const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server');
require('../../actions/transaction_list');
const rest = require('../../libs/rest');
const sinon = require('sinon');

describe('GET /api/transactions', () => {
  beforeEach(() => {
    sinon
      .stub(rest.mempool, 'list')
      .withArgs(0)
      .resolves({
        count: 1,
        txs: [
          {
            txid: '67de335bfd0d098ff415b26e30716b54cd54a6e310897980b25c37610344d46f',
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
      .get('/api/transactions')
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

describe('GET /api/transactions pagination', () => {
  beforeEach(() => {
    sinon.stub(rest.mempool, 'list').resolves({ count: 0, txs: [] });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should use the defaults when no parameter is given', done => {
    supertest(app)
      .get('/api/transactions')
      .expect(200)
      .then(() => {
        assert.strictEqual(rest.mempool.list.calledOnceWith(0), true);
        done();
      })
      .catch(done);
  });

  it('should offset by the fixed page size', done => {
    supertest(app)
      .get('/api/transactions')
      .query({ page: '3' })
      .expect(200)
      .then(() => {
        assert.strictEqual(rest.mempool.list.calledOnceWith(50), true);
        done();
      })
      .catch(done);
  });

  it('should ignore perPage because the page size is fixed', done => {
    supertest(app)
      .get('/api/transactions')
      .query({ perPage: '101', page: '2' })
      .expect(200)
      .then(() => {
        assert.strictEqual(rest.mempool.list.calledOnceWith(25), true);
        done();
      })
      .catch(done);
  });

  it('should return 400 for a page that is not a positive integer', done => {
    supertest(app)
      .get('/api/transactions')
      .query({ perPage: '25', page: 'abc' })
      .expect(400)
      .then(() => {
        assert.strictEqual(rest.mempool.list.called, false);
        done();
      })
      .catch(done);
  });

  it('should return 400 for a page beyond the safe integer range', done => {
    supertest(app)
      .get('/api/transactions')
      .query({ page: '1'.repeat(400) })
      .expect(400)
      .then(() => {
        assert.strictEqual(rest.mempool.list.called, false);
        done();
      })
      .catch(done);
  });
});
