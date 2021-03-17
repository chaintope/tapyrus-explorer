const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server');
require('../../actions/transaction_detail');
const rest = require('../../libs/rest');
const sinon = require('sinon');

describe('GET /tx/:txid', () => {
  beforeEach(() => {
    sinon
      .stub(rest.transaction, 'get')
      .withArgs(
        'a82d9931eece4f2504691810db4a11d406a6eb2345b739fc35bb4f993d85e7c8'
      )
      .resolves({
        txid:
          'a82d9931eece4f2504691810db4a11d406a6eb2345b739fc35bb4f993d85e7c8',
        hash:
          'fa305c408bbedc3043658845b1605b0f02e89dc471b9c86d1b74a7b8b1b9d531',
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
            value: 5000000000,
            scriptpubkey:
              '76a914ac667b7d8e87f9d06edca03bb88ac76a9146713b478d99432a88ac',
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
      })
      .withArgs(
        'a82d9931eece4f2504691810db4a11d406a6eb2345b739fc35bb4f993d85e7c3'
      )
      .resolves(undefined);

    sinon.stub(rest.block.tip, 'height').resolves(82737);
  });

  afterEach(() => {
    sinon.restore();
  });

  context('existing tx', () => {
    it('should return transaction information', done => {
      supertest(app)
        .get(
          '/tx/a82d9931eece4f2504691810db4a11d406a6eb2345b739fc35bb4f993d85e7c8'
        )
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          const transaction = res.body;
          assert.strictEqual(
            transaction.txid,
            'a82d9931eece4f2504691810db4a11d406a6eb2345b739fc35bb4f993d85e7c8'
          );
          assert.strictEqual(
            transaction.hash,
            'fa305c408bbedc3043658845b1605b0f02e89dc471b9c86d1b74a7b8b1b9d531'
          );
          assert.strictEqual(transaction.size, 90);
          assert.strictEqual(transaction.weight, 360);
          assert.strictEqual(transaction.locktime, 0);
          assert.strictEqual(
            transaction.status.block_hash,
            '69b5964caf1e85883dfe60ddf4ace9e301e7b21a923f8fc82f47b0deae366a2b'
          );
          assert.strictEqual(transaction.status.block_time, 1599509432);

          assert.strictEqual(transaction.vin[0].coinbase, '08f2770101');
          assert.strictEqual(transaction.vin[0].sequence, 9672954294);

          assert.strictEqual(transaction.vout[0].value, 5000000000);
          assert.strictEqual(
            transaction.vout[0].scriptpubkey_asm,
            'OP_DUP OP_HASH160 6713b478d99432aac667b7d8e87f9d06edca03bb OP_EQUALVERIFY OP_CHECKSIG'
          );
          assert.strictEqual(
            transaction.vout[0].scriptpubkey,
            '76a914ac667b7d8e87f9d06edca03bb88ac76a9146713b478d99432a88ac'
          );
          assert.strictEqual(transaction.vout[0].scriptpubkey_type, 'p2pkh');
          assert.strictEqual(
            transaction.vout[0].scriptpubkey_address,
            '1AQ2CtG3jho78SrEzKe3vf6dxcEkJt5nzA'
          );

          done();
        })
        .catch(done);
    });
  });

  context('unknown tx', () => {
    it('should return 404 response.', done => {
      supertest(app)
        .get(
          '/tx/a82d9931eece4f2504691810db4a11d406a6eb2345b739fc35bb4f993d85e7c3'
        )
        .expect(404)
        .then(res => {
          done();
        })
        .catch(done);
    });
  });
});

describe('GET /tx/:txid/rawData', () => {
  beforeEach(() => {
    sinon
      .stub(rest.transaction, 'raw')
      .withArgs(
        'a82d9931eece4f2504691810db4a11d406a6eb2345b739fc35bb4f993d85e7c8'
      )
      .resolves(
        '01000000010000000000000000000000000000000000000000000000000000000000000000c57700000502c5770101ffffffff0100f2052a010000001976a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac00000000'
      );
  });

  afterEach(() => {
    sinon.restore();
  });

  it('/tx/:txid/rawData', done => {
    supertest(app)
      .get(
        '/tx/a82d9931eece4f2504691810db4a11d406a6eb2345b739fc35bb4f993d85e7c8/rawData'
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        const rawTransaction = res.body.hex;
        assert.strictEqual(
          rawTransaction,
          '01000000010000000000000000000000000000000000000000000000000000000000000000c57700000502c5770101ffffffff0100f2052a010000001976a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac00000000'
        );
        done();
      })
      .catch(done);
  });

  afterEach(() => {
    sinon.restore();
  });
});

describe('GET /tx/:txid/get', () => {
  beforeEach(() => {
    sinon
      .stub(rest.transaction, 'get')
      .withArgs(
        'a82d9931eece4f2504691810db4a11d406a6eb2345b739fc35bb4f993d85e7c8'
      )
      .resolves({
        txid:
          'a82d9931eece4f2504691810db4a11d406a6eb2345b739fc35bb4f993d85e7c8',
        hash:
          'fa305c408bbedc3043658845b1605b0f02e89dc471b9c86d1b74a7b8b1b9d531',
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
            value: 5000000000,
            scriptpubkey:
              '76a914ac667b7d8e87f9d06edca03bb88ac76a9146713b478d99432a88ac',
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

  it('/tx/:txid/get', done => {
    supertest(app)
      .get(
        '/tx/a82d9931eece4f2504691810db4a11d406a6eb2345b739fc35bb4f993d85e7c8/get'
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        const getTransaction = res.body;

        assert.strictEqual(
          getTransaction.txid,
          'a82d9931eece4f2504691810db4a11d406a6eb2345b739fc35bb4f993d85e7c8'
        );
        assert.strictEqual(
          getTransaction.hash,
          'fa305c408bbedc3043658845b1605b0f02e89dc471b9c86d1b74a7b8b1b9d531'
        );
        assert.strictEqual(getTransaction.size, 90);
        assert.strictEqual(getTransaction.weight, 360);
        assert.strictEqual(getTransaction.locktime, 0);
        assert.strictEqual(
          getTransaction.status.block_hash,
          '69b5964caf1e85883dfe60ddf4ace9e301e7b21a923f8fc82f47b0deae366a2b'
        );
        assert.strictEqual(getTransaction.status.block_time, 1599509432);

        assert.strictEqual(getTransaction.vin[0].coinbase, '08f2770101');
        assert.strictEqual(getTransaction.vin[0].sequence, 9672954294);

        assert.strictEqual(getTransaction.vout[0].value, 5000000000);
        assert.strictEqual(
          getTransaction.vout[0].scriptpubkey_asm,
          'OP_DUP OP_HASH160 6713b478d99432aac667b7d8e87f9d06edca03bb OP_EQUALVERIFY OP_CHECKSIG'
        );
        assert.strictEqual(
          getTransaction.vout[0].scriptpubkey,
          '76a914ac667b7d8e87f9d06edca03bb88ac76a9146713b478d99432a88ac'
        );
        assert.strictEqual(getTransaction.vout[0].scriptpubkey_type, 'p2pkh');
        assert.strictEqual(
          getTransaction.vout[0].scriptpubkey_address,
          '1AQ2CtG3jho78SrEzKe3vf6dxcEkJt5nzA'
        );

        done();
      })
      .catch(done);
  });
});
