const app = require('../app.js');
const logger = require('../libs/logger');
const rest = require('../libs/rest');
const { isHash, isColorId, updateAddress, sortTxs } = require('../libs/util');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/api/color/:colorId', async (req, res) => {
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
    txs = sortTxs(txs);
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

app.get('/api/color/:colorId/metadata', async (req, res) => {
  const colorId = req.params.colorId;

  if (!isColorId(colorId)) {
    logger.error(`Invalid colorId(${colorId}) - /color/${colorId}/metadata`);
    res.status(400).send('Bad request');
    return;
  }

  try {
    const metadata = await rest.tokenRegistry.getMetadata(colorId);
    if (metadata) {
      res.json(metadata);
    } else {
      res.status(404).send('Metadata not found');
    }
  } catch (error) {
    logger.error(
      `Error retrieving token metadata - ${colorId}. Error Message - ${error.message}`
    );
    res.status(500).send('Internal server error');
  }
});
