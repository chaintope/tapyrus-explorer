const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server');
require('../../actions/address_detail');
const electrs = require('../../libs/electrs');

const sinon = require('sinon');

describe('GET /address return type check', function () {
  it('/address', function (done) {
    this.timeout(5000);
    supertest(app)
      .get('/address/1EH5UTrkqwzy56tG8kSctVeTDHLkhjg7g')
      .query({ perPage: '25', page: 1 })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        const addressResponse = JSON.parse(res.text);
        assert.ok(addressResponse[0].toString());
        assert.ok(addressResponse[1]);
        assert.ok(addressResponse[2].toString());
        assert.ok(addressResponse[3].toString());

        assert.strictEqual(typeof addressResponse[0], 'number');
        assert.ok(Array.isArray(addressResponse[1]));
        assert.strictEqual(typeof addressResponse[2], 'number');
        assert.strictEqual(typeof addressResponse[3], 'number');

        done();
      });
  });
});

describe('GET /address with sinon.stub', function () {
  beforeEach(() => {
    sinon
      .stub(electrs.blockchain.scripthash, 'get_balance')
      .withArgs(
        '38bf47ffa420b5ff50a3ca04411a4f4b3c7f6ea63a47732674501ab67776d923'
      )
      .resolves([{ confirmed: 109988776, unconfirmed: 0 }]);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('/address', function (done) {
    this.timeout(5000);
    supertest(app)
      .get('/address/1AX2nLM8dnZH3g5tT2hDAJ4Y3UiYwqkHNX')
      .query({ perPage: '25', page: 1 })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);

        assert.strictEqual(res.body[0], 109988776);

        supertest(app)
          .get('/address/1AX2nLM8dnZH3g5tT2hDAJ4Y3UiYwqkHNX')
          .query({ perPage: '25', page: res.body[3] / 25 + 1 })
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (transErr, transRes) {
            if (transErr) done(transErr);

            const balance = transRes.body[0];
            assert.notStrictEqual(balance, 0);

            done();
          });
      });
  });
});
