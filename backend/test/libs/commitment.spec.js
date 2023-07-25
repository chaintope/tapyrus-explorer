const Commitment = require('../../libs/commitment');
const assert = require('assert');
const config = require('../../libs/config');

describe('Commitment', () => {
  beforeEach(() => {
    config.network = 'dev';
  });

  describe('.point', () => {
    it('should return commitment', () => {
      const materials = [
        { name: 'A', quantity: 600, unit: 'g' },
        { name: 'B', quantity: 200, unit: 'g' },
        { name: 'C', quantity: 200, unit: 'g' }
      ];
      const R =
        '03439fefcb45eddebaa738aaee2d936178cdb9f1df6b8597069e09fff6b28b907e';
      const point =
        '0314aac39d7c5c1e3fb3b8c878098640b7b2146a19541e59792f6d7c87266d673a';

      assert.strictEqual(
        new Commitment(materials, R).point().toHex(true),
        point
      );
    });
  });
});
