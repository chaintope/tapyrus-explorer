const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server');
require('../../actions/transaction_list');
const rest = require('../../libs/rest');
const sinon = require('sinon');

describe('GET /transactions', () => {
  beforeEach(() => {
    sinon
      .stub(rest.mempool, 'list')
      .withArgs(0)
      .resolves({
        count: 1,
        txs: [
          {
            txid:
              '67de335bfd0d098ff415b26e30716b54cd54a6e310897980b25c37610344d46f',
            fee: 0.1,
            vsize: 225,
            time: 1607586380,
            value: 400000000
          }
        ]
      });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return recent transactions', done => {
    supertest(app)
      .get('/transactions')
      .query({ perPage: '25', page: 1 })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        assert.strictEqual(res.body.results.length, 1);
        const tx = res.body.results[0];
        assert.strictEqual(
          tx.txid,
          '67de335bfd0d098ff415b26e30716b54cd54a6e310897980b25c37610344d46f'
        );
        assert.strictEqual(tx.time, 1607586380);
        assert.strictEqual(tx.value, 400000000);
        done();
      })
      .catch(done);
  });
});
