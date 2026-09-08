const util = require('../../libs/util');
const assert = require('assert');
const fixtures = require('../fixtures/txs.json');
const config = require('../../libs/config');

describe('util', () => {
  beforeEach(() => {
    config.network = 'dev';
  });

  describe('isColor', () => {
    it('should return true if it is valid', () => {
      const reissuable =
        'C1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
      assert.strictEqual(util.isColorId(reissuable), true);
      const nonReissuable =
        'C2FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
      assert.strictEqual(util.isColorId(nonReissuable), true);
      const nft =
        'C3FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
      assert.strictEqual(util.isColorId(nft), true);
    });

    it('should return false if it is invalid', () => {
      const invalidColorId =
        '00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
      assert.strictEqual(util.isColorId(invalidColorId), false);
    });

    it('should return false if it is too short', () => {
      const tooShortColorId =
        'C1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
      assert.strictEqual(util.isColorId(tooShortColorId), false);
    });

    it('should return false if it is too long', () => {
      const tooLongColorId =
        'C1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
      assert.strictEqual(util.isColorId(tooLongColorId), false);
    });
  });

  describe('isBlockHeight', () => {
    it('should return true for a decimal number', () => {
      assert.strictEqual(util.isBlockHeight('0'), true);
      assert.strictEqual(util.isBlockHeight('1236'), true);
      assert.strictEqual(util.isBlockHeight(1236), true);
    });

    it('should return false for a value that is not a decimal number', () => {
      assert.strictEqual(util.isBlockHeight('abc'), false);
      assert.strictEqual(util.isBlockHeight('-1'), false);
      assert.strictEqual(util.isBlockHeight('1.5'), false);
      assert.strictEqual(util.isBlockHeight(''), false);
      assert.strictEqual(util.isBlockHeight(undefined), false);
    });

    it('should return false for a value that traverses the path', () => {
      assert.strictEqual(util.isBlockHeight('../../blocks/tip/height'), false);
    });
  });

  describe('toOutputIndex', () => {
    it('should accept a non negative integer', () => {
      assert.strictEqual(util.toOutputIndex(0), 0);
      assert.strictEqual(util.toOutputIndex(3), 3);
    });

    it('should accept a decimal string', () => {
      assert.strictEqual(util.toOutputIndex('0'), 0);
      assert.strictEqual(util.toOutputIndex('3'), 3);
      assert.strictEqual(util.toOutputIndex('03'), 3);
    });

    it('should return null for a negative value', () => {
      assert.strictEqual(util.toOutputIndex(-1), null);
      assert.strictEqual(util.toOutputIndex('-1'), null);
    });

    it('should return null for a value that is not an integer', () => {
      assert.strictEqual(util.toOutputIndex(1.5), null);
      assert.strictEqual(util.toOutputIndex('1.5'), null);
      assert.strictEqual(util.toOutputIndex('abc'), null);
      assert.strictEqual(util.toOutputIndex('0x1'), null);
    });

    it('should return null for a value that coerces to zero', () => {
      assert.strictEqual(util.toOutputIndex(''), null);
      assert.strictEqual(util.toOutputIndex(null), null);
      assert.strictEqual(util.toOutputIndex(undefined), null);
      assert.strictEqual(util.toOutputIndex([]), null);
      assert.strictEqual(util.toOutputIndex({}), null);
      assert.strictEqual(util.toOutputIndex(true), null);
    });

    it('should return null beyond the safe integer range', () => {
      assert.strictEqual(util.toOutputIndex('9007199254740993'), null);
      assert.strictEqual(util.toOutputIndex('1'.repeat(400)), null);
    });
  });

  describe('forLog', () => {
    it('should quote the value', () => {
      assert.strictEqual(util.forLog('abc'), '"abc"');
    });

    it('should escape a newline so that a log line cannot be forged', () => {
      assert.strictEqual(
        util.forLog('a\nERROR fake line'),
        '"a\\nERROR fake line"'
      );
    });

    it('should cap the length at 64 characters', () => {
      assert.strictEqual(util.forLog('a'.repeat(100)), `"${'a'.repeat(64)}"`);
    });

    it('should accept a value that is not a string', () => {
      assert.strictEqual(util.forLog(undefined), '"undefined"');
      assert.strictEqual(util.forLog(12), '"12"');
      assert.strictEqual(util.forLog(['a', 'b']), '"a,b"');
    });
  });

  describe('parsePagination', () => {
    it('should use the defaults when a value is not given', () => {
      assert.deepStrictEqual(util.parsePagination(undefined, undefined), {
        perPage: 25,
        page: 1
      });
      assert.deepStrictEqual(util.parsePagination('', ''), {
        perPage: 25,
        page: 1
      });
    });

    it('should accept a value within the range', () => {
      assert.deepStrictEqual(util.parsePagination('1', '1'), {
        perPage: 1,
        page: 1
      });
      assert.deepStrictEqual(util.parsePagination('100', '9999'), {
        perPage: 100,
        page: 9999
      });
    });

    it('should return null for a perPage above the limit', () => {
      assert.strictEqual(util.parsePagination('101', '1'), null);
      assert.strictEqual(util.parsePagination('100000000', '1'), null);
    });

    it('should return null for a value that is not a positive integer', () => {
      assert.strictEqual(util.parsePagination('0', '1'), null);
      assert.strictEqual(util.parsePagination('-1', '1'), null);
      assert.strictEqual(util.parsePagination('25.5', '1'), null);
      assert.strictEqual(util.parsePagination('abc', '1'), null);
      assert.strictEqual(util.parsePagination('25', '0'), null);
      assert.strictEqual(util.parsePagination('25', 'abc'), null);
    });

    it('should return null when the same parameter is given more than once', () => {
      assert.strictEqual(util.parsePagination(['25', '30'], '1'), null);
    });

    it('should return null beyond the safe integer range', () => {
      assert.strictEqual(util.parsePagination('25', '1'.repeat(400)), null);
      assert.strictEqual(
        util.parsePagination('25', '1000000000000000000000'),
        null
      );
      assert.strictEqual(util.parsePagination('25', '9007199254740993'), null);
    });

    it('should return null when the offset would leave the safe integer range', () => {
      // Both values are safe integers on their own, but their product is not.
      assert.strictEqual(util.parsePagination('100', '9007199254740991'), null);
    });
  });

  describe('parseStartIndex', () => {
    it('should use the first page when a value is not given', () => {
      assert.deepStrictEqual(util.parseStartIndex(undefined), {
        page: 1,
        startIndex: 0
      });
      assert.deepStrictEqual(util.parseStartIndex(''), {
        page: 1,
        startIndex: 0
      });
    });

    it('should offset by the fixed page size', () => {
      assert.deepStrictEqual(util.parseStartIndex('2'), {
        page: 2,
        startIndex: 25
      });
      assert.deepStrictEqual(util.parseStartIndex('4'), {
        page: 4,
        startIndex: 75
      });
    });

    it('should return null for a value that is not a positive integer', () => {
      assert.strictEqual(util.parseStartIndex('0'), null);
      assert.strictEqual(util.parseStartIndex('-1'), null);
      assert.strictEqual(util.parseStartIndex('1.5'), null);
      assert.strictEqual(util.parseStartIndex('abc'), null);
    });

    it('should return null when the same parameter is given more than once', () => {
      assert.strictEqual(util.parseStartIndex(['1', '2']), null);
    });

    it('should return null when the offset would leave the safe integer range', () => {
      assert.strictEqual(util.parseStartIndex('1'.repeat(400)), null);
      assert.strictEqual(util.parseStartIndex('9007199254740991'), null);
    });
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
