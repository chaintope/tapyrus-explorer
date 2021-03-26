const app = require('../app.js');
const logger = require('../libs/logger');
const rest = require('../libs/rest');
const { isHash, updateAddress } = require('../libs/util');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/tx/:txid', async (req, res) => {
  const txid = req.params.txid;

  if (!isHash(txid)) {
    console.error(`Invalid txid(${txid}) -- /tx/${txid}`);
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
    res.json(tx);
  } catch (error) {
    logger.error(
      `Error retrieving information for transaction - ${txid}. Error Message - ${error.message}`
    );
  }
});

app.get('/tx/:txid/rawData', async (req, res) => {
  const txid = req.params.txid;

  if (!isHash(txid)) {
    console.error(`Invalid txid(${txid}) -- /tx/${txid}/rawData`);
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
      `Error retrieving rawdata for transaction - ${txid}. Error Message - ${error.message}`
    );
  }
});

app.get('/tx/:txid/get', async (req, res) => {
  const txid = req.params.txid;
  if (!isHash(txid)) {
    console.error(`Invalid txid(${txid}) -- /tx/${txid}/get`);
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
      `Error calling the method gettransaction for transaction - ${txid}. Error Message - ${error.message}`
    );
  }
});
