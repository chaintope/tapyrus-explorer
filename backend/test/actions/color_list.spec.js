const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server');
require('../../actions/color_list');
const rest = require('../../libs/rest');
const sinon = require('sinon');

describe('GET /api/colors', () => {
  const colorId =
    'c1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

  beforeEach(() => {
    sinon.stub(rest.color, 'list').resolves([{ color_id: colorId }]);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return colors when lastSeenColorId is omitted', done => {
    supertest(app)
      .get('/api/colors')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        assert.deepStrictEqual(res.body, { colors: [{ color_id: colorId }] });
        assert.strictEqual(rest.color.list.calledOnce, true);
        done();
      })
      .catch(done);
  });

  it('should return colors when lastSeenColorId is empty', done => {
    supertest(app)
      .get('/api/colors?lastSeenColorId=')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(() => {
        assert.strictEqual(rest.color.list.calledOnce, true);
        done();
      })
      .catch(done);
  });

  it('should return colors for a valid lastSeenColorId', done => {
    supertest(app)
      .get(`/api/colors?lastSeenColorId=${colorId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(() => {
        assert.strictEqual(rest.color.list.calledOnceWith(colorId), true);
        done();
      })
      .catch(done);
  });

  it('should return 400 for an invalid lastSeenColorId', done => {
    supertest(app)
      .get('/api/colors?lastSeenColorId=invalid')
      .expect(400)
      .then(() => {
        assert.strictEqual(rest.color.list.called, false);
        done();
      })
      .catch(done);
  });

  it('should return 400 without calling esplora for a traversing lastSeenColorId', done => {
    supertest(app)
      .get('/api/colors?lastSeenColorId=..%2F..%2Fblocks%2Ftip%2Fheight')
      .expect(400)
      .then(() => {
        assert.strictEqual(rest.color.list.called, false);
        done();
      })
      .catch(done);
  });
});
