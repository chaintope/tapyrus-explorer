const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server');
const rest = require('../../libs/rest');
require('../../actions/block_list');
const fixtures = require('../fixtures/blocks.json');

const sinon = require('sinon');

describe('GET /blocks and then call individual block using /block/:blockHash', () => {
  beforeEach(() => {
    sinon.stub(rest.block.tip, 'height').resolves(30);
    sinon
      .stub(rest.block, 'list')
      .withArgs(30)
      .resolves(fixtures.blocks_1)
      .withArgs(20)
      .resolves(fixtures.blocks_2);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('/blocks', done => {
    supertest(app)
      .get('/blocks')
      .query({ perPage: '15', page: 1 })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        assert.strictEqual(res.body.results.length, 15);
        assert.strictEqual(
          res.body.results[0].id,
          'afdb81579b0b0158a419b5bc567244f149cd62a23a5ed928f3466c096afccf56'
        );
        done();
      })
      .catch(done);
  });
});
