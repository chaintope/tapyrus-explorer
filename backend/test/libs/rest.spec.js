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

    const accepted = txid => ({
      ok: true,
      status: 200,
      text: () => Promise.resolve(txid)
    });
    const refused = message => ({
      ok: false,
      status: 400,
      text: () => Promise.resolve(message)
    });
    const timeout = () =>
      Promise.reject(
        new DOMException(
          'The operation was aborted due to timeout',
          'TimeoutError'
        )
      );

    // Answers each node URL with the given function of the request.
    const stubNodes = answers =>
      sinon.stub(global, 'fetch').callsFake((url, options) => {
        const node = Object.keys(answers).find(base => url === `${base}/tx`);
        return answers[node](options);
      });

    let originalBroadcastUrls;
    let warn;

    beforeEach(() => {
      originalBroadcastUrls = config.broadcastUrls;
      warn = sinon.stub(logger, 'warn');
    });

    afterEach(() => {
      config.broadcastUrls = originalBroadcastUrls;
      sinon.restore();
    });

    it('should post only to the REST host when no broadcast URL is set', async () => {
      config.broadcastUrls = [];
      const fetch = sinon.stub(global, 'fetch').resolves(accepted(TXID));

      assert.strictEqual(await rest.transaction.broadcast(RAW_TX), TXID);
      assert.strictEqual(fetch.callCount, 1);
      assert.strictEqual(
        fetch.firstCall.args[0],
        `${config.rest.schema}://${config.rest.host}:${config.rest.port}/tx`
      );
    });

    it('should post the same transaction to every node', async () => {
      config.broadcastUrls = [NODE_A, NODE_B];
      const fetch = stubNodes({
        [NODE_A]: () => Promise.resolve(accepted(TXID)),
        [NODE_B]: () => Promise.resolve(accepted(TXID))
      });

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

    it('should succeed when one node accepts and another reports missing inputs', async () => {
      config.broadcastUrls = [NODE_A, NODE_B];
      stubNodes({
        [NODE_A]: () => Promise.resolve(refused(MISSING_INPUTS)),
        [NODE_B]: () => Promise.resolve(accepted(TXID))
      });

      assert.strictEqual(await rest.transaction.broadcast(RAW_TX), TXID);
    });

    it('should answer with the first success without waiting for the other nodes', async () => {
      config.broadcastUrls = [NODE_A, NODE_B];
      let answerB;
      stubNodes({
        [NODE_A]: () => Promise.resolve(accepted(TXID)),
        [NODE_B]: () =>
          new Promise((_, reject) => {
            answerB = reject;
          })
      });

      assert.strictEqual(await rest.transaction.broadcast(RAW_TX), TXID);

      // The post still running fails afterwards without surfacing anywhere.
      answerB(new TypeError('fetch failed'));
      await new Promise(resolve => setImmediate(resolve));
      assert.ok(warn.calledOnce);
      assert.match(warn.firstCall.args[0], /10\.0\.0\.2:5001.*fetch failed/);
    });

    it('should report the refusal of the first node in order when every node refuses', async () => {
      config.broadcastUrls = [NODE_A, NODE_B];
      stubNodes({
        [NODE_A]: () => Promise.resolve(refused(MISSING_INPUTS)),
        [NODE_B]: () => Promise.resolve(refused('other reason'))
      });

      await assert.rejects(
        () => rest.transaction.broadcast(RAW_TX),
        error => error.message === MISSING_INPUTS
      );
    });

    it('should report a refusal over a connection failure', async () => {
      config.broadcastUrls = [NODE_A, NODE_B];
      stubNodes({
        [NODE_A]: () => Promise.reject(new TypeError('fetch failed')),
        [NODE_B]: () => Promise.resolve(refused(MISSING_INPUTS))
      });

      await assert.rejects(
        () => rest.transaction.broadcast(RAW_TX),
        error => error.message === MISSING_INPUTS
      );
    });

    it('should report a refusal over a server error', async () => {
      config.broadcastUrls = [NODE_A, NODE_B];
      stubNodes({
        [NODE_A]: () =>
          Promise.resolve({
            ok: false,
            status: 503,
            text: () => Promise.resolve('daemon unavailable')
          }),
        [NODE_B]: () => Promise.resolve(refused(MISSING_INPUTS))
      });

      await assert.rejects(
        () => rest.transaction.broadcast(RAW_TX),
        error => error.message === MISSING_INPUTS
      );
    });

    it('should report a refusal over a timeout', async () => {
      config.broadcastUrls = [NODE_A, NODE_B];
      stubNodes({
        [NODE_A]: timeout,
        [NODE_B]: () => Promise.resolve(refused(MISSING_INPUTS))
      });

      await assert.rejects(
        () => rest.transaction.broadcast(RAW_TX),
        error => error.message === MISSING_INPUTS
      );
    });

    it('should report the first failure when no node could be asked', async () => {
      config.broadcastUrls = [NODE_A, NODE_B];
      stubNodes({
        [NODE_A]: timeout,
        [NODE_B]: () => Promise.reject(new TypeError('fetch failed'))
      });

      await assert.rejects(
        () => rest.transaction.broadcast(RAW_TX),
        error => error.message === 'The operation was aborted due to timeout'
      );
    });

    it('should succeed when one node accepts and another cannot be reached', async () => {
      config.broadcastUrls = [NODE_A, NODE_B];
      stubNodes({
        [NODE_A]: () => Promise.reject(new TypeError('fetch failed')),
        [NODE_B]: () => Promise.resolve(accepted(TXID))
      });

      assert.strictEqual(await rest.transaction.broadcast(RAW_TX), TXID);
    });

    it('should not put the node URLs in the error passed to the client', async () => {
      config.broadcastUrls = [NODE_A, NODE_B];
      stubNodes({
        [NODE_A]: () => Promise.reject(new TypeError('fetch failed')),
        [NODE_B]: () => Promise.reject(new TypeError('fetch failed'))
      });

      await assert.rejects(
        () => rest.transaction.broadcast(RAW_TX),
        error => !error.message.includes('10.0.0.')
      );
    });
  });
});
