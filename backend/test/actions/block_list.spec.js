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

describe('GET /api/blocks esplora call count', () => {
  beforeEach(() => {
    // A tip far above perPage, so the loop is bounded by perPage rather than
    // by reaching the genesis block.
    sinon.stub(rest.block.tip, 'height').resolves(1000);
    sinon.stub(rest.block, 'list').resolves([]);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should make one call per ten blocks of the page', done => {
    supertest(app)
      .get('/api/blocks')
      .query({ perPage: '100', page: 1 })
      .expect(200)
      .then(() => {
        // Blocks 1000 down to 901, and esplora returns ten per call.
        assert.strictEqual(rest.block.list.callCount, 10);
        assert.strictEqual(rest.block.list.firstCall.args[0], 1000);
        done();
      })
      .catch(done);
  });

  it('should not grow the number of calls beyond the perPage limit', done => {
    supertest(app)
      .get('/api/blocks')
      .query({ perPage: '101', page: 1 })
      .expect(400)
      .then(() => {
        assert.strictEqual(rest.block.list.called, false);
        done();
      })
      .catch(done);
  });
});
