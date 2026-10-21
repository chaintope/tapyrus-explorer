const app = require('../app.js');
const logger = require('../libs/logger');
const rest = require('../libs/rest');
const {
  isHash,
  forLog,
  updateAddress,
  isMaterialTrackingTransaction
} = require('../libs/util');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/api/tx/:txid', async (req, res) => {
  const txid = req.params.txid;

  if (!isHash(txid)) {
    logger.error(`Invalid txid(${forLog(txid)}) -- /tx`);
    res.status(400).send('Bad request');
    return;
  }

  try {
    const tx = await rest.transaction.get(txid);
    if (!tx) {
      res.status(404).send('Tx not found');
      return;
    }
    updateAddress(tx);
    const height = await rest.block.tip.height();
    tx['status']['confirmations'] = height - tx['status']['block_height'] + 1;
    tx['isMaterialTracking'] = isMaterialTrackingTransaction(tx);
    res.json(tx);
  } catch (error) {
    logger.error(
      `Error retrieving information for transaction - ${forLog(txid)}. Error Message - ${error.message}`
    );
    res.status(503).send('Service Temporary Unavailable');
  }
});

app.get('/api/tx/:txid/rawData', async (req, res) => {
  const txid = req.params.txid;

  if (!isHash(txid)) {
    logger.error(`Invalid txid(${forLog(txid)}) -- /tx/rawData`);
    res.status(400).send('Bad request');
    return;
  }

  try {
    const tx = await rest.transaction.raw(txid);
    if (!tx) {
      res.status(404).send('Tx not found');
      return;
    }
    res.json({ hex: tx });
  } catch (error) {
    logger.error(
      `Error retrieving rawdata for transaction - ${forLog(txid)}. Error Message - ${error.message}`
    );
    res.status(503).send('Service Temporary Unavailable');
  }
});

app.get('/api/tx/:txid/get', async (req, res) => {
  const txid = req.params.txid;
  if (!isHash(txid)) {
    logger.error(`Invalid txid(${forLog(txid)}) -- /tx/get`);
    res.status(400).send('Bad request');
    return;
  }

  try {
    const tx = await rest.transaction.get(txid);
    if (!tx) {
      res.status(404).send('Tx not found');
      return;
    }
    res.json(tx);
  } catch (error) {
    logger.error(
      `Error calling the method gettransaction for transaction - ${forLog(txid)}. Error Message - ${error.message}`
    );
    res.status(503).send('Service Temporary Unavailable');
  }
});

// A node that did not answer in time may still have accepted the
// transaction. Building and sending it again would then spend the same inputs
// twice, so the client is told the result is not known rather than that it
// failed.
const BROADCAST_RESULT_UNKNOWN =
  'Broadcast result unknown: the node did not answer in time. The transaction may have been accepted; check whether it is in the mempool before sending it again.';

app.post('/api/tx', async (req, res) => {
  const rawTxHex = req.body;

  if (
    !rawTxHex ||
    typeof rawTxHex !== 'string' ||
    !/^[0-9a-fA-F]+$/.test(rawTxHex)
  ) {
    logger.error('Invalid raw transaction hex');
    res.status(400).send('Bad request: invalid hex');
    return;
  }

  try {
    const txid = await rest.transaction.broadcast(rawTxHex);
    res.send(txid);
  } catch (error) {
    logger.error(
      `Error broadcasting transaction. Error Message - ${error.message}`
    );
    if (error.kind === 'rejected') {
      res.status(400).send(error.message);
    } else if (error.kind === 'unknown') {
      res.status(504).send(BROADCAST_RESULT_UNKNOWN);
    } else {
      res.status(503).send('Service Temporary Unavailable');
    }
  }
});
