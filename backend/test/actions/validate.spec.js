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
            scriptpubkey_type: 'nulldata'
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

  it('should return { valid: false } for invalid signature', done => {
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
});
