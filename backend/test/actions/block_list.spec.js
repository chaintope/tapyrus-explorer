const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server');
const rest = require('../../libs/rest');
require('../../actions/block_list');
const fixtures = require('../fixtures/blocks.json');

const sinon = require('sinon');

describe('GET /api/blocks and then call individual block using /block/:blockHash', () => {
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

  it('/api/blocks', done => {
    supertest(app)
      .get('/api/blocks')
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

describe('GET /api/blocks pagination', () => {
  beforeEach(() => {
    sinon.stub(rest.block.tip, 'height').resolves(30);
    sinon
      .stub(rest.block, 'list')
      .withArgs(30)
      .resolves(fixtures.blocks_1)
      .withArgs(20)
      .resolves(fixtures.blocks_2)
      .withArgs(10)
      .resolves([])
      .withArgs(0)
      .resolves([]);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should use the default perPage when no parameter is given', done => {
    supertest(app)
      .get('/api/blocks')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        assert.strictEqual(res.body.results.length, 20);
        assert.strictEqual(res.body.bestHeight, 30);
        // 25 blocks are asked for, and esplora returns 10 per call.
        assert.strictEqual(rest.block.list.callCount, 3);
        done();
      })
      .catch(done);
  });

  it('should bound the number of esplora calls at the perPage limit', done => {
    supertest(app)
      .get('/api/blocks')
      .query({ perPage: '100', page: 1 })
      .expect(200)
      .then(() => {
        assert.ok(
          rest.block.list.callCount <= 10,
          `called ${rest.block.list.callCount} times`
        );
        done();
      })
      .catch(done);
  });

  it('should return 400 for a perPage above the limit', done => {
    supertest(app)
      .get('/api/blocks')
      .query({ perPage: '100000000', page: 1 })
      .expect(400)
      .then(() => {
        assert.strictEqual(rest.block.list.called, false);
        assert.strictEqual(rest.block.tip.height.called, false);
        done();
      })
      .catch(done);
  });

  it('should return 400 for a perPage that is not a positive integer', done => {
    supertest(app)
      .get('/api/blocks')
      .query({ perPage: 'abc', page: 1 })
      .expect(400)
      .then(() => {
        assert.strictEqual(rest.block.list.called, false);
        done();
      })
      .catch(done);
  });

  it('should return 400 for a page below 1', done => {
    supertest(app)
      .get('/api/blocks')
      .query({ perPage: '25', page: '0' })
      .expect(400)
      .then(() => {
        assert.strictEqual(rest.block.list.called, false);
        done();
      })
      .catch(done);
  });
});
