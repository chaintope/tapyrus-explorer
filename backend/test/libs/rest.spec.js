const assert = require('assert');
const sinon = require('sinon');

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
});
