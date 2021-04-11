const app = require('../app.js');
const logger = require('../libs/logger');
const rest = require('../libs/rest');
const { isHash, isColorId, updateAddress} = require('../libs/util');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/color/:colorId', async (req, res) => {
  const colorId = req.params.colorId;
  const lastSeenTxid = req.query.lastSeenTxid;

  try {
    if (!isColorId(colorId)) {
      logger.error(`Invalid colorId(${colorId}) - /color/${colorId}`);
      res.status(400).send('Bad request');
      return;
    }

    if (lastSeenTxid && !isHash(lastSeenTxid)) {
      logger.error(`Invalid lastSeenTxid(${lastSeenTxid}) - /color/${colorId}`);
      res.status(400).send('Bad request');
      return;
    }

    const stats = await rest.color.get(colorId);
    let txs = await rest.color.txs(colorId, lastSeenTxid);
    txs = txs.sort((tx1, tx2) => tx2.time - tx1.time);
    txs.forEach(updateAddress);

    res.json({
      stats,
      tx: {
        txs,
        last_seen_txid: (txs[txs.length - 1] || {}).txid
      }
    });
  } catch (error) {
    logger.error(
      `Error retrieving color stats  - ${colorId}. Error Message - ${error.message}`
    );
  }
});
