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

    it('should keep a valid value as it is', async () => {
      const colorId =
        'c1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      await rest.color.list(colorId);
      assert.ok(fetched[0].endsWith(`/colors/${colorId}`), fetched[0]);
    });

    it('should not let a value add path segments', async () => {
      await rest.color.list('../../blocks/tip/height');
      assert.ok(
        fetched[0].endsWith('/colors/..%2F..%2Fblocks%2Ftip%2Fheight'),
        fetched[0]
      );
    });

    it('should not let a value add path segments to a block height', async () => {
      await rest.block.height('../../blocks/tip/height');
      assert.ok(
        fetched[0].endsWith('/block-height/..%2F..%2Fblocks%2Ftip%2Fheight'),
        fetched[0]
      );
    });

    it('should not let a value add path segments to a transaction', async () => {
      await rest.transaction.get('../../blocks/tip/height');
      assert.ok(
        fetched[0].endsWith('/tx/..%2F..%2Fblocks%2Ftip%2Fheight'),
        fetched[0]
      );
    });

    it('should not let a value of ".." climb a path segment', async () => {
      await rest.transaction.raw('..');
      assert.ok(fetched[0].endsWith('/tx/%2E%2E/hex'), fetched[0]);
    });

    it('should not let a value of "." drop a path segment', async () => {
      await rest.transaction.raw('.');
      assert.ok(fetched[0].endsWith('/tx/%2E/hex'), fetched[0]);
    });

    it('should not let a value of ".." drop the last path segment', async () => {
      await rest.color.list('..');
      assert.ok(fetched[0].endsWith('/colors/%2E%2E'), fetched[0]);
    });
  });
});
