const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server');
require('../../actions/block_detail');
const cl = require('../../libs/tapyrusd').client;
const rest = require('../../libs/rest');
const RpcError = require('bitcoin-core/dist/src/errors/rpc-error').default;
const sinon = require('sinon');

describe('GET /block/:blockHash', function () {
  beforeEach(() => {
    sinon
      .stub(cl, 'getBlock')
      .withArgs(
        '5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6'
      )
      .resolves({
        hash:
          '5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6',
        size: 261,
        weight: 1044,
        height: 1236,
        features: 1,
        merkleroot:
          '39b95731fbae308d85743e2682988038980d7463ea2fc1b21f91860b243892e9',
        immutablemerkleroot:
          'd837966bc672b6459385989fdbfc049773f03fd355bb62c9765cdfa51e7a19a4',
        time: 1598253741,
        proof:
          '9fd45dcb188a5547a34fe2d181c24fd8f0f68b88d6c8951ec4db921a133dd846fb77d030bdacb1e421c49e23483937ce2c5eb3693baae040ddda8316ea3b6127',
        nTx: 1,
        previousblockhash:
          '471b4c1fcb6105c9812edde93c6dd760330daa8b3897a9484a24c3ce23683805',
        nextblockhash:
          'e17286ef05705b03f2396f28f06b9afafa4502157285ad1d1ebc08537d27de57'
      })
      .withArgs(
        '5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420fe'
      )
      .throws(new RpcError(-5, 'Block not found'));
  });

  afterEach(() => {
    sinon.restore();
  });

  context('existing block', function () {
    it('should return block information.', function (done) {
      supertest(app)
        .get(
          '/block/5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6'
        )
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          const body = res.body;

          assert.strictEqual(
            body.blockHash,
            '5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6'
          );
          assert.strictEqual(body.ntx, 1);
          assert.strictEqual(body.height, 1236);
          assert.strictEqual(body.timestamp, 1598253741);
          assert.strictEqual(
            body.proof,
            '9fd45dcb188a5547a34fe2d181c24fd8f0f68b88d6c8951ec4db921a133dd846fb77d030bdacb1e421c49e23483937ce2c5eb3693baae040ddda8316ea3b6127'
          );
          assert.strictEqual(body.sizeBytes, 261);
          assert.strictEqual(body.version, 1);
          assert.strictEqual(
            body.merkleRoot,
            '39b95731fbae308d85743e2682988038980d7463ea2fc1b21f91860b243892e9'
          );
          assert.strictEqual(
            body.immutableMerkleRoot,
            'd837966bc672b6459385989fdbfc049773f03fd355bb62c9765cdfa51e7a19a4'
          );
          assert.strictEqual(
            body.previousBlock,
            '471b4c1fcb6105c9812edde93c6dd760330daa8b3897a9484a24c3ce23683805'
          );
          assert.strictEqual(
            body.nextBlock,
            'e17286ef05705b03f2396f28f06b9afafa4502157285ad1d1ebc08537d27de57'
          );

          done();
        })
        .catch(done);
    });
  });

  context('unknown block', function () {
    it('should return 404 response.', function (done) {
      supertest(app)
        .get(
          '/block/5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420fe'
        )
        .expect(404)
        .then(res => {
          done();
        })
        .catch(done);
    });
  });
});

describe('GET /block/:blockHash/raw', function () {
  beforeEach(() => {
    sinon
      .stub(cl, 'getBlock')
      .withArgs(
        '5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6',
        0
      )
      .resolves(
        '0100000075adc0f804073eee1c74988e1e1bd83c85f987e34a95fd714813e379a724e85f97d679310470c26fdfaed7167075c7a8a1fa34d9c67be9c45c246281c15ffb231d0ef017e1b2147099d84709bcc0fbe89ef4d579fa8a95192ce89671765ec90459d4455f0040e7f72ce96424573b0d18f707333d02a2bc546491ba197c3af7b52d559eb55765d00a1e99d6ef4175ec4aae134c6b496a87c78d3a41ed77c7c2fd4ba684cd4abd01010000000100000000000000000000000000000000000000000000000000000000000000008a69000005028a690101ffffffff0100f2052a010000001976a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac00000000'
      );
  });

  afterEach(() => {
    sinon.restore();
  });

  it('/block/:blockHash/raw', function (done) {
    supertest(app)
      .get(
        '/block/5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6/raw'
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        const body = res.body;
        assert.strictEqual(
          body,
          '0100000075adc0f804073eee1c74988e1e1bd83c85f987e34a95fd714813e379a724e85f97d679310470c26fdfaed7167075c7a8a1fa34d9c67be9c45c246281c15ffb231d0ef017e1b2147099d84709bcc0fbe89ef4d579fa8a95192ce89671765ec90459d4455f0040e7f72ce96424573b0d18f707333d02a2bc546491ba197c3af7b52d559eb55765d00a1e99d6ef4175ec4aae134c6b496a87c78d3a41ed77c7c2fd4ba684cd4abd01010000000100000000000000000000000000000000000000000000000000000000000000008a69000005028a690101ffffffff0100f2052a010000001976a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac00000000'
        );
        done();
      })
      .catch(done);
  });
});

describe('GET /block/:blockHash/txns', function () {
  beforeEach(() => {
    sinon
      .stub(rest.block, 'txs')
      .withArgs(
        '5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6',
        0
      )
      .resolves([
        {
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
                '76a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac',
              scriptpubkey_address: '1AQ2CtG3jho78SrEzKe3vf6dxcEkJt5nzA',
              scriptpubkey_asm:
                'OP_DUP OP_HASH160 6713b478d99432aac667b7d8e87f9d06edca03bb OP_EQUALVERIFY OP_CHECKSIG',
              scriptpubkey_type: 'p2pkh'
            }
          ]
        }
      ]);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('/block/:blockHash/txns', function (done) {
    supertest(app)
      .get(
        '/block/5c6fd3ae9a05a6db255525bd6b1e5e4cb9cfbda876ee39cc809129a9ade420e6/txns'
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        const tx = res.body[0];
        assert.strictEqual(
          tx.txid,
          'a82d9931eece4f2504691810db4a11d406a6eb2345b739fc35bb4f993d85e7c8'
        );
        assert.strictEqual(tx.size, 90);
        assert.strictEqual(tx.weight, 360);
        assert.strictEqual(tx.locktime, 0);
        assert.strictEqual(tx.vin[0].coinbase, '08f2770101');
        assert.strictEqual(tx.vin[0].sequence, 9672954294);
        assert.strictEqual(tx.vout[0].value, 5000000000);
        assert.strictEqual(
          tx.vout[0].scriptpubkey_asm,
          'OP_DUP OP_HASH160 6713b478d99432aac667b7d8e87f9d06edca03bb OP_EQUALVERIFY OP_CHECKSIG'
        );
        assert.strictEqual(
          tx.vout[0].scriptpubkey,
          '76a9146713b478d99432aac667b7d8e87f9d06edca03bb88ac'
        );
        assert.strictEqual(tx.vout[0].scriptpubkey_type, 'p2pkh');
        assert.strictEqual(
          tx.vout[0].scriptpubkey_address,
          '1AQ2CtG3jho78SrEzKe3vf6dxcEkJt5nzA'
        );

        done();
      })
      .catch(done);
  });
});
