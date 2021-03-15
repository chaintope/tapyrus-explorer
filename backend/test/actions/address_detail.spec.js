const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server');
require('../../actions/address_detail');
const rest = require('../../libs/rest');
const sinon = require('sinon');
const fixtures = require('../fixtures/txs.json');

describe('GET /address', () => {
  beforeEach(() => {
    sinon
      .stub(rest.address, 'stats')
      .withArgs('12FmjcAHuen1gptnZoSZ7MLWmNhZny6GmP')
      .resolves({
        chain_stats: {
          '000000000000000000000000000000000000000000000000000000000000000000': {
            tx_count: 10,
            funded_txo_sum: 109988776,
            spent_txo_sum: 100000000
          }
        }
      });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('without lastSeenTxid', () => {
    beforeEach(() => {
      sinon
        .stub(rest.address, 'txs')
        .withArgs('12FmjcAHuen1gptnZoSZ7MLWmNhZny6GmP')
        .resolves(fixtures.txs);
    });
    it('should return balances and txs', done => {
      supertest(app)
        .get('/address/12FmjcAHuen1gptnZoSZ7MLWmNhZny6GmP')
        .query({})
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          assert.strictEqual(res.body['balances'][0]['received'], 109988776);
          assert.strictEqual(res.body['balances'][0]['sent'], 100000000);
          assert.strictEqual(res.body['balances'][0]['balanced'], 9988776);
          assert.strictEqual(
            res.body['tx']['last_seen_txid'],
            'b9112788b9509306bedd77142f24e3a647190ecb5351a22e71eb203dec0f28fc'
          );
          assert.strictEqual(
            res.body['tx']['txs'][0]['txid'],
            '5a5bd50a42410ddadd16df50b46ec8b73e51fd71538bc434aa47222f146e6b60'
          );
          assert.strictEqual(
            res.body['tx']['txs'][2]['txid'],
            'b9112788b9509306bedd77142f24e3a647190ecb5351a22e71eb203dec0f28fc'
          );
          done();
        })
        .catch(done);
    });
  });

  describe('with lastSeenTxid', () => {
    beforeEach(() => {
      sinon
        .stub(rest.address, 'txs')
        .withArgs(
          '12FmjcAHuen1gptnZoSZ7MLWmNhZny6GmP',
          'b9112788b9509306bedd77142f24e3a647190ecb5351a22e71eb203dec0f28fc'
        )
        .resolves(fixtures.txs_next);
    });
    it('should return balances and txs', done => {
      supertest(app)
        .get('/address/12FmjcAHuen1gptnZoSZ7MLWmNhZny6GmP')
        .query({
          lastSeenTxid:
            'b9112788b9509306bedd77142f24e3a647190ecb5351a22e71eb203dec0f28fc'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          assert.strictEqual(res.body['balances'][0]['received'], 109988776);
          assert.strictEqual(res.body['balances'][0]['sent'], 100000000);
          assert.strictEqual(res.body['balances'][0]['balanced'], 9988776);
          assert.strictEqual(
            res.body['tx']['last_seen_txid'],
            '41d38dc35b98113ce280428b6a988e50a6d7ab33235d63cb1c23f72706903175'
          );
          assert.strictEqual(
            res.body['tx']['txs'][0]['txid'],
            'db9b2baa8382a2c35f7041fd7599218eb65fa9136ff7c454849231a491e44bf5'
          );
          assert.strictEqual(
            res.body['tx']['txs'][2]['txid'],
            '41d38dc35b98113ce280428b6a988e50a6d7ab33235d63cb1c23f72706903175'
          );
          done();
        })
        .catch(done);
    });
  });
});
