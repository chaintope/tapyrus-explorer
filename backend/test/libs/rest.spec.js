const assert = require('assert');

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
});
