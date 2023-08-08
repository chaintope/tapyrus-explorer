const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server');
require('../../actions/validate');
const rest = require('../../libs/rest');
const sinon = require('sinon');
const fixtures = require('../fixtures/opened_values.json');

describe('GET /api/validate/:opened_value', () => {
  beforeEach(() => {
    sinon
      .stub(rest.transaction, 'get')
      .withArgs(
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      )
      .resolves({
        txid:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        hash:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        size: 90,
        weight: 360,
        locktime: 0,
        vin: [
          {
            coinbase: '08f2770101',
            sequence: 9672954294,
            prevout: null,
            scriptsig: '0308f2770101',
            scriptsig_asm: 'OP_PUSHBYTES_3 08f277 OP_PUSHBYTES_1 01'
          }
        ],
        vout: [
          {
            value: 0,
            scriptpubkey:
              '6a2654500222010314aac39d7c5c1e3fb3b8c878098640b7b2146a19541e59792f6d7c87266d673a',
            scriptpubkey_asm:
              'OP_RETURN 54500222010314aac39d7c5c1e3fb3b8c878098640b7b2146a19541e59792f6d7c87266d673a',
            scriptpubkey_type: 'op_return'
          },
          {
            value: 600,
            scriptpubkey: '76a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac',
            scriptpubkey_address: '1AQ2CtG3jho78SrEzKe3vf6dxcEkJt5nzA',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 6713b478d99432aac667b7d8e87f9d06edca03bb OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          }
        ],
        status: {
          block_hash:
            '69b5964caf1e85883dfe60ddf4ace9e301e7b21a923f8fc82f47b0deae366a2b',
          block_height: 82737,
          block_time: 1599509432,
          confirmed: true
        }
      });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return { valid: true } for valid opened value', done => {
    const openedValue = fixtures[0]['encoded'];
    supertest(app)
      .get(`/api/validate/${openedValue}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        assert.deepStrictEqual(res.body, fixtures[0]['decoded']);
        done();
      })
      .catch(done);
  });

  it('should return { valid: false } for invalid opened value', done => {
    const openedValue = fixtures[1]['encoded'];
    supertest(app)
      .get(`/api/validate/${openedValue}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        assert.deepStrictEqual(res.body, fixtures[1]['decoded']);
        done();
      })
      .catch(done);
  });

  it('should return { valid: false } for invalid commitment', done => {
    const openedValue = fixtures[2]['encoded'];
    supertest(app)
      .get(`/api/validate/${openedValue}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        assert.deepStrictEqual(res.body, fixtures[2]['decoded']);
        done();
      })
      .catch(done);
  });

  it('should return { valid: false } for invalid signature', done => {
    const openedValue = fixtures[3]['encoded'];
    supertest(app)
      .get(`/api/validate/${openedValue}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        assert.deepStrictEqual(res.body, fixtures[3]['decoded']);
        done();
      })
      .catch(done);
  });
});

describe('/api/check_material_tracking_balance/:txid', () => {
  beforeEach(() => {
    // https://testnet-explorer.tapyrus.dev.chaintope.com/tx/8b4dea4de1b34f861bbbd47044eda3fac9349c7cab7e23186362e75474d2a788
    sinon
      .stub(rest.transaction, 'get')
      .withArgs(
        '8b4dea4de1b34f861bbbd47044eda3fac9349c7cab7e23186362e75474d2a788'
      )
      .resolves({
        txid:
          '8b4dea4de1b34f861bbbd47044eda3fac9349c7cab7e23186362e75474d2a788',
        locktime: 0,
        vin: [
          {
            txid:
              'a2f6c676c18409abfe7b90ec29e35926dad1f43b8be90daf9daeb46bd85c6082',
            vout: 0,
            is_coinbase: false,
            sequence: 4294967295,
            prevout: {
              value: 600,
              scriptpubkey:
                '76a914dcee5a51826ea4337233f210602e0014a18683a388ac',
              scriptpubkey_address: '1M9BCFGZNeJPL8wovhBF3CRtVSjEbUEMky',
              scriptpubkey_asm:
                'OP_DUP OP_HASH160 dcee5a51826ea4337233f210602e0014a18683a3 OP_EQUALVERIFY OP_CHECKSIG',
              scriptpubkey_type: 'p2pkh'
            },
            scriptsig:
              '41a4e28f8dcfb2731675a58dc4343254b34e6acd7bde7f4c76df22b1eb7ef5843fcb6381c3a88c9caa39d87dd525ba1a1060a8e935b063e7d3d6c53951ff1bd5be0121023725e100cb1078ffdeb804399b998b0230aa3c252c744a4400f3e09c0b42ccfa',
            scriptsig_asm:
              'OP_PUSHBYTES_65 a4e28f8dcfb2731675a58dc4343254b34e6acd7bde7f4c76df22b1eb7ef5843fcb6381c3a88c9caa39d87dd525ba1a1060a8e935b063e7d3d6c53951ff1bd5be01 OP_PUSHBYTES_33 023725e100cb1078ffdeb804399b998b0230aa3c252c744a4400f3e09c0b42ccfa'
          },
          {
            txid:
              'dda80933cb6850b8a52c40fef59c5fe44ab7efa6fc4c59128fee521dccc73879',
            vout: 1,
            is_coinbase: false,
            sequence: 4294967295,
            prevout: {
              value: 600,
              scriptpubkey:
                '76a914dcee5a51826ea4337233f210602e0014a18683a388ac',
              scriptpubkey_address: '1M9BCFGZNeJPL8wovhBF3CRtVSjEbUEMky',
              scriptpubkey_asm:
                'OP_DUP OP_HASH160 dcee5a51826ea4337233f210602e0014a18683a3 OP_EQUALVERIFY OP_CHECKSIG',
              scriptpubkey_type: 'p2pkh'
            },
            scriptsig:
              '410c5c2309011b09237819e7861b89e8089c5fdfb8f45f2b1ae0e1490e5a6449140074f2a7a52503073dfb058db0ec0d080b76bb8ba6a103808672dff4982560b00121023725e100cb1078ffdeb804399b998b0230aa3c252c744a4400f3e09c0b42ccfa',
            scriptsig_asm:
              'OP_PUSHBYTES_65 0c5c2309011b09237819e7861b89e8089c5fdfb8f45f2b1ae0e1490e5a6449140074f2a7a52503073dfb058db0ec0d080b76bb8ba6a103808672dff4982560b001 OP_PUSHBYTES_33 023725e100cb1078ffdeb804399b998b0230aa3c252c744a4400f3e09c0b42ccfa'
          },
          {
            txid:
              'aba8c751d886cfdcd28b3f1912eb7cc7b1b8f225d0263cc6bf9a05eb98f373a0',
            vout: 6,
            is_coinbase: false,
            sequence: 4294967295,
            prevout: {
              value: 4000,
              scriptpubkey:
                '76a914b9a5907d54962d2fd4cc800eaf7e110188e029f988ac',
              scriptpubkey_address: '1HvcM78Uy6L3eyGauaDMCwMXEPkCXdtDFc',
              scriptpubkey_asm:
                'OP_DUP OP_HASH160 b9a5907d54962d2fd4cc800eaf7e110188e029f9 OP_EQUALVERIFY OP_CHECKSIG',
              scriptpubkey_type: 'p2pkh'
            },
            scriptsig:
              '41e32a83402c3b7f9296dbbcaa20a4a26799ab9172d0327b2beb250c92b6574d3bad573d9eb9cb9f6bb252a3bdcc22ef7cfae523d358278a724878149ba97f20d4012103c25f445c55fa8ff55a30e673cb3dd963336e6e3a08eca690af910686be4cd953',
            scriptsig_asm:
              'OP_PUSHBYTES_65 e32a83402c3b7f9296dbbcaa20a4a26799ab9172d0327b2beb250c92b6574d3bad573d9eb9cb9f6bb252a3bdcc22ef7cfae523d358278a724878149ba97f20d401 OP_PUSHBYTES_33 03c25f445c55fa8ff55a30e673cb3dd963336e6e3a08eca690af910686be4cd953'
          }
        ],
        vout: [
          {
            value: 0,
            scriptpubkey:
              '6a26545002220103f0347ab72cf52bebf41a6612d1b3d357c309cb48f0ef6abc2cb1b5354ab49f0a',
            scriptpubkey_asm:
              'OP_RETURN 545002220103f0347ab72cf52bebf41a6612d1b3d357c309cb48f0ef6abc2cb1b5354ab49f0a',
            scriptpubkey_type: 'op_return'
          },
          {
            value: 600,
            scriptpubkey: '76a914dcee5a51826ea4337233f210602e0014a18683a388ac',
            scriptpubkey_address: '1M9BCFGZNeJPL8wovhBF3CRtVSjEbUEMky',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 dcee5a51826ea4337233f210602e0014a18683a3 OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          },
          {
            value: 0,
            scriptpubkey:
              '6a26545002220203c77bf0292b31c708b6456d0d80c2d0bf83cd8d677958384b8fa17b5892fa83b4',
            scriptpubkey_asm:
              'OP_RETURN 545002220203c77bf0292b31c708b6456d0d80c2d0bf83cd8d677958384b8fa17b5892fa83b4',
            scriptpubkey_type: 'op_return'
          },
          {
            value: 600,
            scriptpubkey: '76a914dcee5a51826ea4337233f210602e0014a18683a388ac',
            scriptpubkey_address: '1M9BCFGZNeJPL8wovhBF3CRtVSjEbUEMky',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 dcee5a51826ea4337233f210602e0014a18683a3 OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          },
          {
            value: 0,
            scriptpubkey:
              '6a2654500222030347bc06e0bee7ccc6bda264ac254ae5fe86621cf88aa4787b76d1be77dfce58db',
            scriptpubkey_asm:
              'OP_RETURN 54500222030347bc06e0bee7ccc6bda264ac254ae5fe86621cf88aa4787b76d1be77dfce58db',
            scriptpubkey_type: 'op_return'
          },
          {
            value: 600,
            scriptpubkey: '76a91476083751353681cd5bb62b8f0061bf6d2338405288ac',
            scriptpubkey_address: '1Bm6aVy6zYyA5m91SmC7DTgBZSCBcjM9Uj',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 76083751353681cd5bb62b8f0061bf6d23384052 OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          }
        ],
        status: {
          block_hash:
            '69b5964caf1e85883dfe60ddf4ace9e301e7b21a923f8fc82f47b0deae366a2b',
          block_height: 82737,
          block_time: 1599509432,
          confirmed: true
        }
      })
      .withArgs(
        'a2f6c676c18409abfe7b90ec29e35926dad1f43b8be90daf9daeb46bd85c6082'
      )
      .resolves({
        txid:
          'a2f6c676c18409abfe7b90ec29e35926dad1f43b8be90daf9daeb46bd85c6082',
        locktime: 0,
        vin: [
          {
            txid:
              'aba8c751d886cfdcd28b3f1912eb7cc7b1b8f225d0263cc6bf9a05eb98f373a0',
            vout: 11,
            is_coinbase: false,
            sequence: 4294967295,
            prevout: {
              value: 4000,
              scriptpubkey:
                '76a914b9a5907d54962d2fd4cc800eaf7e110188e029f988ac',
              scriptpubkey_address: '1HvcM78Uy6L3eyGauaDMCwMXEPkCXdtDFc',
              scriptpubkey_asm:
                'OP_DUP OP_HASH160 b9a5907d54962d2fd4cc800eaf7e110188e029f9 OP_EQUALVERIFY OP_CHECKSIG',
              scriptpubkey_type: 'p2pkh'
            },
            scriptsig:
              '4161bf77adee252adb5fd670b14713d75321cd368d6f5e752a5036ebf13f45c21dff55dc5e5d5af836fbbbbfd241448f6d9b85f3f9377dbcb64d19ff647dd66044012103c25f445c55fa8ff55a30e673cb3dd963336e6e3a08eca690af910686be4cd953',
            scriptsig_asm:
              'OP_PUSHBYTES_65 61bf77adee252adb5fd670b14713d75321cd368d6f5e752a5036ebf13f45c21dff55dc5e5d5af836fbbbbfd241448f6d9b85f3f9377dbcb64d19ff647dd6604401 OP_PUSHBYTES_33 03c25f445c55fa8ff55a30e673cb3dd963336e6e3a08eca690af910686be4cd953'
          }
        ],
        vout: [
          {
            value: 600,
            scriptpubkey: '76a914dcee5a51826ea4337233f210602e0014a18683a388ac',
            scriptpubkey_address: '1M9BCFGZNeJPL8wovhBF3CRtVSjEbUEMky',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 dcee5a51826ea4337233f210602e0014a18683a3 OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          },
          {
            value: 1400,
            scriptpubkey: '76a914137e1f6d66a04721516b208db7512443a98f8d4f88ac',
            scriptpubkey_address: '12n4vos4Zxpag1c1qYQS9TqitQkwHpq1Ji',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 137e1f6d66a04721516b208db7512443a98f8d4f OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          }
        ],
        status: {
          block_hash:
            '69b5964caf1e85883dfe60ddf4ace9e301e7b21a923f8fc82f47b0deae366a2b',
          block_height: 82737,
          block_time: 1599509432,
          confirmed: true
        }
      })
      .withArgs(
        'dda80933cb6850b8a52c40fef59c5fe44ab7efa6fc4c59128fee521dccc73879'
      )
      .resolves({
        txid:
          'dda80933cb6850b8a52c40fef59c5fe44ab7efa6fc4c59128fee521dccc73879',
        locktime: 0,
        vin: [
          {
            txid:
              'e9e4e4f46f3324cf316aa2f40df540e77cc151d3bfa73bc39dbec78c32cc7704',
            vout: 0,
            is_coinbase: false,
            sequence: 4294967295,
            prevout: {
              value: 600,
              scriptpubkey:
                '76a914dcee5a51826ea4337233f210602e0014a18683a388ac',
              scriptpubkey_address: '1M9BCFGZNeJPL8wovhBF3CRtVSjEbUEMky',
              scriptpubkey_asm:
                'OP_DUP OP_HASH160 dcee5a51826ea4337233f210602e0014a18683a3 OP_EQUALVERIFY OP_CHECKSIG',
              scriptpubkey_type: 'p2pkh'
            },
            scriptsig:
              '41a4e28f8dcfb2731675a58dc4343254b34e6acd7bde7f4c76df22b1eb7ef5843fcb6381c3a88c9caa39d87dd525ba1a1060a8e935b063e7d3d6c53951ff1bd5be0121023725e100cb1078ffdeb804399b998b0230aa3c252c744a4400f3e09c0b42ccfa',
            scriptsig_asm:
              'OP_PUSHBYTES_65 a4e28f8dcfb2731675a58dc4343254b34e6acd7bde7f4c76df22b1eb7ef5843fcb6381c3a88c9caa39d87dd525ba1a1060a8e935b063e7d3d6c53951ff1bd5be01 OP_PUSHBYTES_33 023725e100cb1078ffdeb804399b998b0230aa3c252c744a4400f3e09c0b42ccfa'
          },
          {
            txid:
              'aba8c751d886cfdcd28b3f1912eb7cc7b1b8f225d0263cc6bf9a05eb98f373a0',
            vout: 1,
            is_coinbase: false,
            sequence: 4294967295,
            prevout: {
              value: 4000,
              scriptpubkey:
                '76a914b9a5907d54962d2fd4cc800eaf7e110188e029f988ac',
              scriptpubkey_address: '1HvcM78Uy6L3eyGauaDMCwMXEPkCXdtDFc',
              scriptpubkey_asm:
                'OP_DUP OP_HASH160 b9a5907d54962d2fd4cc800eaf7e110188e029f9 OP_EQUALVERIFY OP_CHECKSIG',
              scriptpubkey_type: 'p2pkh'
            },
            scriptsig:
              '41d364c67221aa1d4ceb2a4490bc9392b13aac9ea6507a63e82bbcce33140572fae1c55058501886a16c97343fdf22e6ffc0bcf25f71c38d57b48738ebafab89c00121023725e100cb1078ffdeb804399b998b0230aa3c252c744a4400f3e09c0b42ccfa',
            scriptsig_asm:
              'OP_PUSHBYTES_65 d364c67221aa1d4ceb2a4490bc9392b13aac9ea6507a63e82bbcce33140572fae1c55058501886a16c97343fdf22e6ffc0bcf25f71c38d57b48738ebafab89c001 OP_PUSHBYTES_33 03c25f445c55fa8ff55a30e673cb3dd963336e6e3a08eca690af910686be4cd953'
          }
        ],
        vout: [
          {
            value: 0,
            scriptpubkey:
              '6a2654500222010357cdf67420dcedff40ec248a920544ef4b8fed00f8d3914bc71effb322e55262',
            scriptpubkey_asm:
              'OP_RETURN 54500222010357cdf67420dcedff40ec248a920544ef4b8fed00f8d3914bc71effb322e55262',
            scriptpubkey_type: 'op_return'
          },
          {
            value: 600,
            scriptpubkey: '76a914b9a5907d54962d2fd4cc800eaf7e110188e029f988ac',
            scriptpubkey_address: '1HvcM78Uy6L3eyGauaDMCwMXEPkCXdtDFc',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 b9a5907d54962d2fd4cc800eaf7e110188e029f9 OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          },
          {
            value: 3591,
            scriptpubkey: '76a914549030d5f66d40809f59e15deea85a5e4939cf9d88ac',
            scriptpubkey_address: '18i8VfVnvyhozZXNM1yfbokZt9dNakjGp1',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 549030d5f66d40809f59e15deea85a5e4939cf9d OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          }
        ],
        status: {
          block_hash:
            '69b5964caf1e85883dfe60ddf4ace9e301e7b21a923f8fc82f47b0deae366a2b',
          block_height: 82737,
          block_time: 1599509432,
          confirmed: true
        }
      })
      .withArgs(
        'aba8c751d886cfdcd28b3f1912eb7cc7b1b8f225d0263cc6bf9a05eb98f373a0'
      )
      .resolves({
        txid:
          'aba8c751d886cfdcd28b3f1912eb7cc7b1b8f225d0263cc6bf9a05eb98f373a0',
        locktime: 0,
        vin: [
          {
            txid:
              '17a38ea0dbc4f243ba5ed19b7df4affc4964abcbc7bb742bc623fe4b386e0caf',
            vout: 0,
            is_coinbase: false,
            sequence: 4294967295,
            prevout: {
              value: 1000000000,
              scriptpubkey:
                '76a914b9a5907d54962d2fd4cc800eaf7e110188e029f988ac',
              scriptpubkey_address: '1HvcM78Uy6L3eyGauaDMCwMXEPkCXdtDFc',
              scriptpubkey_asm:
                'OP_DUP OP_HASH160 b9a5907d54962d2fd4cc800eaf7e110188e029f9 OP_EQUALVERIFY OP_CHECKSIG',
              scriptpubkey_type: 'p2pkh'
            },
            scriptsig:
              '4147e190e486ad477bc4d59e02189bc7aab970612296f1267e538a805bcd060d6dd6d01d20670d34ebcf55d25e0c1f7aab0e70ecaeff5ee970beb010335a67df5b012103c25f445c55fa8ff55a30e673cb3dd963336e6e3a08eca690af910686be4cd953',
            scriptsig_asm:
              'OP_PUSHBYTES_65 47e190e486ad477bc4d59e02189bc7aab970612296f1267e538a805bcd060d6dd6d01d20670d34ebcf55d25e0c1f7aab0e70ecaeff5ee970beb010335a67df5b01 OP_PUSHBYTES_33 03c25f445c55fa8ff55a30e673cb3dd963336e6e3a08eca690af910686be4cd953'
          }
        ],
        vout: [
          {
            value: 600,
            scriptpubkey: '76a914b9a5907d54962d2fd4cc800eaf7e110188e029f988ac',
            scriptpubkey_address: '1HvcM78Uy6L3eyGauaDMCwMXEPkCXdtDFc',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 b9a5907d54962d2fd4cc800eaf7e110188e029f9 OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          },
          {
            value: 600,
            scriptpubkey: '76a914b9a5907d54962d2fd4cc800eaf7e110188e029f988ac',
            scriptpubkey_address: '1HvcM78Uy6L3eyGauaDMCwMXEPkCXdtDFc',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 b9a5907d54962d2fd4cc800eaf7e110188e029f9 OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          },
          {
            value: 600,
            scriptpubkey: '76a914b9a5907d54962d2fd4cc800eaf7e110188e029f988ac',
            scriptpubkey_address: '1HvcM78Uy6L3eyGauaDMCwMXEPkCXdtDFc',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 b9a5907d54962d2fd4cc800eaf7e110188e029f9 OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          },
          {
            value: 600,
            scriptpubkey: '76a914b9a5907d54962d2fd4cc800eaf7e110188e029f988ac',
            scriptpubkey_address: '1HvcM78Uy6L3eyGauaDMCwMXEPkCXdtDFc',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 b9a5907d54962d2fd4cc800eaf7e110188e029f9 OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          },
          {
            value: 600,
            scriptpubkey: '76a914b9a5907d54962d2fd4cc800eaf7e110188e029f988ac',
            scriptpubkey_address: '1HvcM78Uy6L3eyGauaDMCwMXEPkCXdtDFc',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 b9a5907d54962d2fd4cc800eaf7e110188e029f9 OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          },
          {
            value: 600,
            scriptpubkey: '76a914b9a5907d54962d2fd4cc800eaf7e110188e029f988ac',
            scriptpubkey_address: '1HvcM78Uy6L3eyGauaDMCwMXEPkCXdtDFc',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 b9a5907d54962d2fd4cc800eaf7e110188e029f9 OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          },
          {
            value: 600,
            scriptpubkey: '76a914b9a5907d54962d2fd4cc800eaf7e110188e029f988ac',
            scriptpubkey_address: '1HvcM78Uy6L3eyGauaDMCwMXEPkCXdtDFc',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 b9a5907d54962d2fd4cc800eaf7e110188e029f9 OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          },
          {
            value: 999918994,
            scriptpubkey: '76a914b9a5907d54962d2fd4cc800eaf7e110188e029f988ac',
            scriptpubkey_address: '1HvcM78Uy6L3eyGauaDMCwMXEPkCXdtDFc',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 b9a5907d54962d2fd4cc800eaf7e110188e029f9 OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          }
        ],
        status: {
          block_hash:
            '69b5964caf1e85883dfe60ddf4ace9e301e7b21a923f8fc82f47b0deae366a2b',
          block_height: 82737,
          block_time: 1599509432,
          confirmed: true
        }
      })
      .withArgs(
        'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' //invalid tracking transaction
      )
      .resolves({
        txid:
          'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        locktime: 0,
        vin: [
          {
            txid:
              'a2f6c676c18409abfe7b90ec29e35926dad1f43b8be90daf9daeb46bd85c6082',
            vout: 0,
            is_coinbase: false,
            sequence: 4294967295,
            prevout: {
              value: 600,
              scriptpubkey:
                '76a914dcee5a51826ea4337233f210602e0014a18683a388ac',
              scriptpubkey_address: '1M9BCFGZNeJPL8wovhBF3CRtVSjEbUEMky',
              scriptpubkey_asm:
                'OP_DUP OP_HASH160 dcee5a51826ea4337233f210602e0014a18683a3 OP_EQUALVERIFY OP_CHECKSIG',
              scriptpubkey_type: 'p2pkh'
            },
            scriptsig:
              '41a4e28f8dcfb2731675a58dc4343254b34e6acd7bde7f4c76df22b1eb7ef5843fcb6381c3a88c9caa39d87dd525ba1a1060a8e935b063e7d3d6c53951ff1bd5be0121023725e100cb1078ffdeb804399b998b0230aa3c252c744a4400f3e09c0b42ccfa',
            scriptsig_asm:
              'OP_PUSHBYTES_65 a4e28f8dcfb2731675a58dc4343254b34e6acd7bde7f4c76df22b1eb7ef5843fcb6381c3a88c9caa39d87dd525ba1a1060a8e935b063e7d3d6c53951ff1bd5be01 OP_PUSHBYTES_33 023725e100cb1078ffdeb804399b998b0230aa3c252c744a4400f3e09c0b42ccfa'
          },
          {
            txid:
              'dda80933cb6850b8a52c40fef59c5fe44ab7efa6fc4c59128fee521dccc73879',
            vout: 1,
            is_coinbase: false,
            sequence: 4294967295,
            prevout: {
              value: 600,
              scriptpubkey:
                '76a914dcee5a51826ea4337233f210602e0014a18683a388ac',
              scriptpubkey_address: '1M9BCFGZNeJPL8wovhBF3CRtVSjEbUEMky',
              scriptpubkey_asm:
                'OP_DUP OP_HASH160 dcee5a51826ea4337233f210602e0014a18683a3 OP_EQUALVERIFY OP_CHECKSIG',
              scriptpubkey_type: 'p2pkh'
            },
            scriptsig:
              '410c5c2309011b09237819e7861b89e8089c5fdfb8f45f2b1ae0e1490e5a6449140074f2a7a52503073dfb058db0ec0d080b76bb8ba6a103808672dff4982560b00121023725e100cb1078ffdeb804399b998b0230aa3c252c744a4400f3e09c0b42ccfa',
            scriptsig_asm:
              'OP_PUSHBYTES_65 0c5c2309011b09237819e7861b89e8089c5fdfb8f45f2b1ae0e1490e5a6449140074f2a7a52503073dfb058db0ec0d080b76bb8ba6a103808672dff4982560b001 OP_PUSHBYTES_33 023725e100cb1078ffdeb804399b998b0230aa3c252c744a4400f3e09c0b42ccfa'
          },
          {
            txid:
              'aba8c751d886cfdcd28b3f1912eb7cc7b1b8f225d0263cc6bf9a05eb98f373a0',
            vout: 6,
            is_coinbase: false,
            sequence: 4294967295,
            prevout: {
              value: 4000,
              scriptpubkey:
                '76a914b9a5907d54962d2fd4cc800eaf7e110188e029f988ac',
              scriptpubkey_address: '1HvcM78Uy6L3eyGauaDMCwMXEPkCXdtDFc',
              scriptpubkey_asm:
                'OP_DUP OP_HASH160 b9a5907d54962d2fd4cc800eaf7e110188e029f9 OP_EQUALVERIFY OP_CHECKSIG',
              scriptpubkey_type: 'p2pkh'
            },
            scriptsig:
              '41e32a83402c3b7f9296dbbcaa20a4a26799ab9172d0327b2beb250c92b6574d3bad573d9eb9cb9f6bb252a3bdcc22ef7cfae523d358278a724878149ba97f20d4012103c25f445c55fa8ff55a30e673cb3dd963336e6e3a08eca690af910686be4cd953',
            scriptsig_asm:
              'OP_PUSHBYTES_65 e32a83402c3b7f9296dbbcaa20a4a26799ab9172d0327b2beb250c92b6574d3bad573d9eb9cb9f6bb252a3bdcc22ef7cfae523d358278a724878149ba97f20d401 OP_PUSHBYTES_33 03c25f445c55fa8ff55a30e673cb3dd963336e6e3a08eca690af910686be4cd953'
          }
        ],
        vout: [
          {
            value: 0,
            scriptpubkey:
              '6a26545002220103f0347ab72cf52bebf41a6612d1b3d357c309cb48f0ef6abc2cb1b5354ab49f0a',
            scriptpubkey_asm:
              'OP_RETURN 545002220103f0347ab72cf52bebf41a6612d1b3d357c309cb48f0ef6abc2cb1b5354ab49f0a',
            scriptpubkey_type: 'op_return'
          },
          ,
          {
            value: 600,
            scriptpubkey: '76a914dcee5a51826ea4337233f210602e0014a18683a388ac',
            scriptpubkey_address: '1M9BCFGZNeJPL8wovhBF3CRtVSjEbUEMky',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 dcee5a51826ea4337233f210602e0014a18683a3 OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          },
          {
            value: 0,
            scriptpubkey:
              '6a2654500222020347bc06e0bee7ccc6bda264ac254ae5fe86621cf88aa4787b76d1be77dfce58db',
            scriptpubkey_asm:
              'OP_RETURN 54500222020347bc06e0bee7ccc6bda264ac254ae5fe86621cf88aa4787b76d1be77dfce58db',
            scriptpubkey_type: 'op_return'
          },
          {
            value: 600,
            scriptpubkey: '76a914dcee5a51826ea4337233f210602e0014a18683a388ac',
            scriptpubkey_address: '1M9BCFGZNeJPL8wovhBF3CRtVSjEbUEMky',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 dcee5a51826ea4337233f210602e0014a18683a3 OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          },
          {
            value: 0,
            scriptpubkey:
              '6a2654500222030347bc06e0bee7ccc6bda264ac254ae5fe86621cf88aa4787b76d1be77dfce58db',
            scriptpubkey_asm:
              'OP_RETURN 54500222030347bc06e0bee7ccc6bda264ac254ae5fe86621cf88aa4787b76d1be77dfce58db',
            scriptpubkey_type: 'op_return'
          },
          {
            value: 600,
            scriptpubkey: '76a91476083751353681cd5bb62b8f0061bf6d2338405288ac',
            scriptpubkey_address: '1Bm6aVy6zYyA5m91SmC7DTgBZSCBcjM9Uj',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 76083751353681cd5bb62b8f0061bf6d23384052 OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh'
          }
        ],
        status: {
          block_hash:
            '69b5964caf1e85883dfe60ddf4ace9e301e7b21a923f8fc82f47b0deae366a2b',
          block_height: 82737,
          block_time: 1599509432,
          confirmed: true
        }
      });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return true if balanced', done => {
    const txid =
      '8b4dea4de1b34f861bbbd47044eda3fac9349c7cab7e23186362e75474d2a788';
    supertest(app)
      .get(`/api/check_material_tracking_balance/${txid}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        assert.deepStrictEqual(res.body, { balanced: true });
        done();
      })
      .catch(done);
  });

  it('should return false if not balanced', done => {
    const txid =
      'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
    supertest(app)
      .get(`/api/check_material_tracking_balance/${txid}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        assert.deepStrictEqual(res.body, { balanced: false });
        done();
      })
      .catch(done);
  });

  it('should return 400  if invalid txid', done => {
    const txid = 'aa';
    supertest(app)
      .get(`/api/check_material_tracking_balance/${txid}`)
      .expect(400)
      .expect('Content-Type', /html/)
      .then(res => {
        assert.deepStrictEqual(res.text, 'Bad request');
        done();
      })
      .catch(done);
  });

  it('should return 404 Not Found if tx does not exist', done => {
    const txid =
      'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc';
    supertest(app)
      .get(`/api/check_material_tracking_balance/${txid}`)
      .expect(404)
      .expect('Content-Type', /html/)
      .then(res => {
        assert.equal(
          res.text,
          'Tx not found(cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc)'
        );
        done();
      })
      .catch(done);
  });
});
