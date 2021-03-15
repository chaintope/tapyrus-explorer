const tapyrus = require('tapyrusjs-lib');
const app = require('../app.js');
const logger = require('../libs/logger');
const rest = require('../libs/rest');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/address/:address', async (req, res) => {
  // TODO: This API only supports returning 25 records for one request.
  const lastSeenTxid = req.query.lastSeenTxid;
  const address = req.params.address;

  try {
    tapyrus.address.fromBase58Check(address);
  } catch (e) {
    logger.error(`Invalid address - /address/${address}`);
    res.status(400).send('Bad request');
    return;
  }

  if (lastSeenTxid && !/^[0-9a-fA-F]{64}/.test(lastSeenTxid)) {
    logger.error(`Invalid lastSeenTxid(${lastSeenTxid}) - /address/${address}`);
    res.status(400).send('Bad request');
    return;
  }

  try {
    const stats = await rest.address.stats(address);
    let txs = await rest.address.txs(address, lastSeenTxid);
    txs = txs.sort((tx1, tx2) => tx2.time - tx1.time);
    let balances = [];
    for (let [, scriptStats] of Object.entries(stats.chain_stats)) {
      balances.push({
        count: scriptStats.tx_count,
        received: scriptStats.funded_txo_sum,
        sent: scriptStats.spent_txo_sum,
        balanced: scriptStats.funded_txo_sum - scriptStats.spent_txo_sum
      });
    }

    res.json({
      balances,
      tx: {
        txs,
        last_seen_txid: (txs[txs.length - 1] || {}).txid
      }
    });
  } catch (error) {
    logger.error(
      `Error retrieving information for addresss - ${address}. Error Message - ${error.message}`
    );
  }
});
