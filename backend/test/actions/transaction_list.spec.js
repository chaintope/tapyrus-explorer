const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server');
require('../../actions/transaction_list');
const rest = require('../../libs/rest');
const cl = require('../../libs/tapyrusd').client;
const sinon = require('sinon');

describe('GET /transactions and then call individual transaction using /tx/:txid', function () {
  beforeEach(() => {
    sinon.stub(cl, 'getRawMempool').resolves({
      '67de335bfd0d098ff415b26e30716b54cd54a6e310897980b25c37610344d46f': {
        fees: {
          base: 0.1,
          modified: 0.1,
          ancestor: 0.1,
          descendant: 0.1
        },
        size: 225,
        fee: 0.1,
        modifiedfee: 0.1,
        time: 1607586380,
        height: 54547,
        descendantcount: 1,
        descendantsize: 225,
        descendantfees: 10000000,
        ancestorcount: 1,
        ancestorsize: 225,
        ancestorfees: 10000000,
        txid:
          '67de335bfd0d098ff415b26e30716b54cd54a6e310897980b25c37610344d46f',
        depends: [],
        spentby: []
      }
    });
    sinon
      .stub(rest.transaction, 'get')
      .withArgs(
        '67de335bfd0d098ff415b26e30716b54cd54a6e310897980b25c37610344d46f'
      )
      .resolves({
        txid:
          '67de335bfd0d098ff415b26e30716b54cd54a6e310897980b25c37610344d46f',
        vin: [
          {
            txid:
              'eb420c5e67fb1786045f4e5b932b526503c596d3692f44ceba5c2830faaf08dd',
            vout: 0,
            scriptsig:
              '4730440220104a368bfb63b90848dde50fd8101c6dc73b77d7930e905ba464385e3bec1c410220299a3a1b83a86527b7e1cadcd89ff44df444115c96c8a191ac3b7551dc3f57320121037a65e1076bd67f566ea4c1f542141b9b0004b4479c57eb951671cc89c4758e67',
            scriptsig_asm:
              '30440220104a368bfb63b90848dde50fd8101c6dc73b77d7930e905ba464385e3bec1c410220299a3a1b83a86527b7e1cadcd89ff44df444115c96c8a191ac3b7551dc3f5732[ALL] 037a65e1076bd67f566ea4c1f542141b9b0004b4479c57eb951671cc89c4758e67',
            sequence: 4294967294,
            prevout: {
              value: 400000000,
              scriptpubkey:
                '76a914846dbba7c781c8103efca5be3ceead6ba6eba1ea88ac',
              scriptpubkey_asm:
                'OP_DUP OP_HASH160 846dbba7c781c8103efca5be3ceead6ba6eba1ea OP_EQUALVERIFY OP_CHECKSIG',
              scriptpubkey_type: 'p2pkh',
              scriptpubkey_address: '1D5DehxQTUG7vHq6i3EQE8JnBb6SDcqZkS'
            }
          }
        ],
        vout: [
          {
            value: 400000000,
            scriptpubkey: '76a914846dbba7c781c8103efca5be3ceead6ba6eba1ea88ac',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 846dbba7c781c8103efca5be3ceead6ba6eba1ea OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh',
            scriptpubkey_address: '1D5DehxQTUG7vHq6i3EQE8JnBb6SDcqZkS'
          }
        ]
      })
      .withArgs(
        'eb420c5e67fb1786045f4e5b932b526503c596d3692f44ceba5c2830faaf08dd'
      )
      .resolves({
        txid:
          'eb420c5e67fb1786045f4e5b932b526503c596d3692f44ceba5c2830faaf08dd',
        vout: [
          {
            value: 400000000,
            scriptpubkey: '76a914846dbba7c781c8103efca5be3ceead6ba6eba1ea88ac',
            scriptpubkey_asm:
              'OP_DUP OP_HASH160 846dbba7c781c8103efca5be3ceead6ba6eba1ea OP_EQUALVERIFY OP_CHECKSIG',
            scriptpubkey_type: 'p2pkh',
            scriptpubkey_address: '1D5DehxQTUG7vHq6i3EQE8JnBb6SDcqZkS'
          }
        ]
      });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return recent transactions', function (done) {
    this.timeout(5000);
    supertest(app)
      .get('/transactions')
      .query({ perPage: '25', page: 1 })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        else {
          assert.strictEqual(res.body.results.length, 1);
          const tx = res.body.results[0];
          assert.strictEqual(
            tx.txid,
            '67de335bfd0d098ff415b26e30716b54cd54a6e310897980b25c37610344d46f'
          );
          assert.strictEqual(tx.time, 1607586380);
          assert.strictEqual(tx.amount, 400000000);
          done();
        }
      });
  });
});
