const util = require('../../libs/util');
const assert = require('assert');
const fixtures = require('../fixtures/txs.json');
const config = require('../../libs/config');

describe('util', () => {
  beforeEach(() => {
    config.network = 'dev';
  });
  describe('splitColor', () => {
    it('should return same address for uncolored address', () => {
      const output = '76a914305e993346ffe2480c3e507bd73773eb932790db88ac';
      const [colorId, address] = util.splitColor(output);
      assert.strictEqual(colorId, null);
      assert.strictEqual(address, 'mjvi45Q34fiaVWLf9SE3fduWcvntaureBH');
    });

    it('should return different address for colored address', () => {
      const output =
        '21c13c630f9d53c11847a662c963dfb1e05a8630dcb901262533cb2f590c480cc734bc76a91437d8a6977e2b61459c594c8da713a2aeac7516b188ac';
      const [colorId, address] = util.splitColor(output);
      assert.strictEqual(
        colorId,
        'c13c630f9d53c11847a662c963dfb1e05a8630dcb901262533cb2f590c480cc734'
      );
      assert.strictEqual(address, 'mkcEzmBn4vFcZ2AE471Ho6TY46DH9q8jgv');
    });
  });

  describe('updateAddress', () => {
    it('update uncolored address', () => {
      const tx = fixtures.colored_txs[0];
      util.updateAddress(tx);
      // uncolored input(p2pkh)
      assert.strictEqual(
        tx.vin[0].prevout.scriptpubkey_uncolored_address,
        'mjvi45Q34fiaVWLf9SE3fduWcvntaureBH'
      );

      // colored input(cp2pkh)
      assert.strictEqual(
        tx.vin[1].prevout.scriptpubkey_uncolored_address,
        'mkcEzmBn4vFcZ2AE471Ho6TY46DH9q8jgv'
      );

      // colored output(cp2pkh)
      assert.strictEqual(
        tx.vout[0].scriptpubkey_uncolored_address,
        'mkcEzmBn4vFcZ2AE471Ho6TY46DH9q8jgv'
      );

      // uncolored output(p2pkh)
      assert.strictEqual(
        tx.vout[1].scriptpubkey_uncolored_address,
        'mjvi45Q34fiaVWLf9SE3fduWcvntaureBH'
      );
    });
  });
});
