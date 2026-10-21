const assert = require('assert');
const sinon = require('sinon');
const config = require('../../libs/config');
const logger = require('../../libs/logger');

describe('rest module', () => {
  describe('require', () => {
    it('should be able to require rest module', () => {
      // This test verifies that the rest module can be loaded.
      // Uses Node.js built-in global fetch (no external dependencies).
      const rest = require('../../libs/rest');

      assert.ok(rest.address, 'address should be defined');
      assert.ok(rest.transaction, 'transaction should be defined');
      assert.ok(rest.block, 'block should be defined');
      assert.ok(rest.color, 'color should be defined');
      assert.ok(rest.mempool, 'mempool should be defined');

      // Verify that functions are exported correctly
      assert.strictEqual(typeof rest.address.stats, 'function');
      assert.strictEqual(typeof rest.address.txs, 'function');
      assert.strictEqual(typeof rest.transaction.get, 'function');
      assert.strictEqual(typeof rest.transaction.raw, 'function');
      assert.strictEqual(typeof rest.block.get, 'function');
      assert.strictEqual(typeof rest.block.list, 'function');
      assert.strictEqual(typeof rest.block.height, 'function');
      assert.strictEqual(typeof rest.block.tip.height, 'function');
    });
  });

  describe('path segments', () => {
    const rest = require('../../libs/rest');
    let fetched;

    beforeEach(() => {
      fetched = [];
      sinon.stub(global, 'fetch').callsFake(url => {
        fetched.push(url);
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
          text: () => Promise.resolve('')
        });
      });
    });

    afterEach(() => {
      sinon.restore();
    });

    // The URL parser resolves relative segments, so what esplora receives is
    // the path of the parsed URL, not the string the module put together. A
    // test that reads the string before parsing passes while the request still
    // lands somewhere else.
    const pathOf = url => new URL(url).pathname;

    it('should keep a valid value as it is', async () => {
      const colorId =
        'c1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      await rest.color.list(colorId);
      assert.strictEqual(pathOf(fetched[0]), `/colors/${colorId}`);
    });

    it('should not let a value add path segments', async () => {
      await rest.color.list('../../blocks/tip/height');
      assert.strictEqual(
        pathOf(fetched[0]),
        '/colors/..%2F..%2Fblocks%2Ftip%2Fheight'
      );
    });

    it('should not let a value add path segments to a block height', async () => {
      await rest.block.height('../../blocks/tip/height');
      assert.strictEqual(
        pathOf(fetched[0]),
        '/block-height/..%2F..%2Fblocks%2Ftip%2Fheight'
      );
    });

    it('should not let a value add path segments to a transaction', async () => {
      await rest.transaction.get('../../blocks/tip/height');
      assert.strictEqual(
        pathOf(fetched[0]),
        '/tx/..%2F..%2Fblocks%2Ftip%2Fheight'
      );
    });

    it('should refuse a value of ".." rather than request another endpoint', async () => {
      await assert.rejects(
        () => rest.transaction.raw('..'),
        /invalid path segment/
      );
      assert.deepStrictEqual(fetched, []);
    });

    it('should refuse a value of "." rather than request another endpoint', async () => {
      await assert.rejects(
        () => rest.transaction.raw('.'),
        /invalid path segment/
      );
      assert.deepStrictEqual(fetched, []);
    });

    it('should refuse a value of ".." on the last path segment', async () => {
      await assert.rejects(() => rest.color.list('..'), /invalid path segment/);
      assert.deepStrictEqual(fetched, []);
    });

    // Encoding a value that spells out the dots is not the same thing: the
    // parser reads the segment before percent-decoding it, so "%2e%2e" arrives
    // as "%252e%252e" and stays a segment of its own.
    it('should keep an encoded ".." as a segment of its own', async () => {
      await rest.color.list('%2e%2e');
      assert.strictEqual(pathOf(fetched[0]), '/colors/%252e%252e');
    });
  });

  describe('transaction.broadcast', () => {
    const rest = require('../../libs/rest');
    const RAW_TX = '0100000001';
    const TXID =
      'a82d9931eece4f2504691810db4a11d406a6eb2345b739fc35bb4f993d85e7c8';
    const MISSING_INPUTS =
      'sendrawtransaction RPC error: {"code":-25,"message":"Missing inputs"}';
    const NODE_A = 'http://10.0.0.1:5001';
    const NODE_B = 'http://10.0.0.2:5001';

    const answer = (status, text) => () =>
      Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        text: () => Promise.resolve(text)
      });
    const accepted = answer(200, TXID);
    const refused = answer(400, MISSING_INPUTS);
    const timeout = () =>
      Promise.reject(
        new DOMException(
          'The operation was aborted due to timeout',
          'TimeoutError'
        )
      );
    const unreachable = () => Promise.reject(new TypeError('fetch failed'));

    // Answers each node URL with the given function of the request.
    const stubNodes = answers =>
      sinon.stub(global, 'fetch').callsFake((url, options) => {
        const node = Object.keys(answers).find(base => url === `${base}/tx`);
        return answers[node](options);
      });

    const failsWith = (kind, message) => error =>
      error.kind === kind &&
      (message === undefined || error.message === message);

    // The log is written once every post has settled, which is after the
    // broadcast has answered.
    const settled = () => new Promise(resolve => setImmediate(resolve));

    let originalBroadcastUrls;
    let info;
    let warn;

    beforeEach(() => {
      originalBroadcastUrls = config.broadcastUrls;
      config.broadcastUrls = [NODE_A, NODE_B];
      info = sinon.stub(logger, 'info');
      warn = sinon.stub(logger, 'warn');
    });

    afterEach(() => {
      config.broadcastUrls = originalBroadcastUrls;
      sinon.restore();
    });

    it('should post only to the REST host, with the time limit, when no broadcast URL is set', async () => {
      config.broadcastUrls = [];
      const fetch = sinon.stub(global, 'fetch').callsFake(accepted);

      assert.strictEqual(await rest.transaction.broadcast(RAW_TX), TXID);
      assert.strictEqual(fetch.callCount, 1);
      assert.strictEqual(
        fetch.firstCall.args[0],
        `${config.rest.schema}://${config.rest.host}:${config.rest.port}/tx`
      );
      assert.ok(fetch.firstCall.args[1].signal instanceof AbortSignal);
    });

    it('should post the same transaction to every node', async () => {
      const fetch = stubNodes({ [NODE_A]: accepted, [NODE_B]: accepted });

      await rest.transaction.broadcast(RAW_TX);

      assert.deepStrictEqual(
        fetch.getCalls().map(call => call.args[0]),
        [`${NODE_A}/tx`, `${NODE_B}/tx`]
      );
      fetch.getCalls().forEach(call => {
        assert.strictEqual(call.args[1].method, 'POST');
        assert.strictEqual(call.args[1].body, RAW_TX);
        assert.ok(call.args[1].signal instanceof AbortSignal);
      });
    });

    it('should succeed when one node accepts and another reports missing inputs, logging below warn', async () => {
      stubNodes({ [NODE_A]: refused, [NODE_B]: accepted });

      assert.strictEqual(await rest.transaction.broadcast(RAW_TX), TXID);

      await settled();
      assert.ok(warn.notCalled);
      assert.ok(info.calledOnce);
      assert.match(info.firstCall.args[0], /10\.0\.0\.1:5001.*Missing inputs/);
    });

    it('should answer with the first success without waiting for the other nodes', async () => {
      let failB;
      stubNodes({
        [NODE_A]: accepted,
        [NODE_B]: () =>
          new Promise((_, reject) => {
            failB = reject;
          })
      });

      assert.strictEqual(await rest.transaction.broadcast(RAW_TX), TXID);

      // The post still running fails afterwards without surfacing anywhere.
      failB(new TypeError('fetch failed'));
      await settled();
      assert.ok(warn.notCalled);
      assert.ok(info.calledOnce);
      assert.match(info.firstCall.args[0], /10\.0\.0\.2:5001.*fetch failed/);
    });

    it('should succeed when one node accepts and another cannot be reached', async () => {
      stubNodes({ [NODE_A]: unreachable, [NODE_B]: accepted });

      assert.strictEqual(await rest.transaction.broadcast(RAW_TX), TXID);
    });

    it('should report the refusal of the first node in order when every node refuses', async () => {
      stubNodes({ [NODE_A]: refused, [NODE_B]: answer(400, 'other reason') });

      await assert.rejects(
        () => rest.transaction.broadcast(RAW_TX),
        failsWith('rejected', MISSING_INPUTS)
      );
    });

    it('should log every failure at warn when no node accepts', async () => {
      stubNodes({ [NODE_A]: refused, [NODE_B]: unreachable });

      await assert.rejects(() => rest.transaction.broadcast(RAW_TX));

      await settled();
      assert.strictEqual(warn.callCount, 2);
      assert.ok(info.notCalled);
    });

    it('should report a refusal over a connection failure', async () => {
      stubNodes({ [NODE_A]: unreachable, [NODE_B]: refused });

      await assert.rejects(
        () => rest.transaction.broadcast(RAW_TX),
        failsWith('rejected', MISSING_INPUTS)
      );
    });

    it('should report a refusal over a server error', async () => {
      stubNodes({
        [NODE_A]: answer(503, 'daemon unavailable'),
        [NODE_B]: refused
      });

      await assert.rejects(
        () => rest.transaction.broadcast(RAW_TX),
        failsWith('rejected', MISSING_INPUTS)
      );
    });

    // A proxy in front of a misconfigured URL answers 404 with its own page.
    it('should not take a status other than 400 for a refusal', async () => {
      stubNodes({
        [NODE_A]: answer(404, '<html>Not Found</html>'),
        [NODE_B]: refused
      });

      await assert.rejects(
        () => rest.transaction.broadcast(RAW_TX),
        failsWith('rejected', MISSING_INPUTS)
      );
    });

    it('should report a node that could not be asked when no node refuses', async () => {
      stubNodes({
        [NODE_A]: answer(404, '<html>Not Found</html>'),
        [NODE_B]: unreachable
      });

      await assert.rejects(
        () => rest.transaction.broadcast(RAW_TX),
        failsWith('unavailable')
      );
    });

    // The node that timed out may have accepted the transaction, so whether
    // it went through is not known.
    it('should report an unknown result over a refusal when a node timed out', async () => {
      stubNodes({ [NODE_A]: refused, [NODE_B]: timeout });

      await assert.rejects(
        () => rest.transaction.broadcast(RAW_TX),
        failsWith('unknown')
      );
    });

    it('should report an unknown result when the only node timed out', async () => {
      config.broadcastUrls = [];
      sinon.stub(global, 'fetch').callsFake(timeout);

      await assert.rejects(
        () => rest.transaction.broadcast(RAW_TX),
        failsWith('unknown')
      );
    });
  });
});
