const app = require('../app.js');
const tapyrusd = require('../libs/tapyrusd').client;
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

app.get('/block/:blockHash', async (req, res) => {
  const blockHash = req.params.blockHash;

  if (!isHash(blockHash)) {
    logger.error(`Invaid block hash(${blockHash}) - /block/${blockHash}`);
    res.status(400).send('Invalid block hash.');
    return;
  }

  try {
    const blockInfo = await tapyrusd.getBlock(blockHash);

    res.json({
      blockHash: blockInfo.hash,
      confirmations: blockInfo.confirmations,
      ntx: blockInfo.nTx,
      height: blockInfo.height,
      timestamp: blockInfo.time,
      proof: blockInfo.proof,
      sizeBytes: blockInfo.size,
      version: blockInfo.features,
      merkleRoot: blockInfo.merkleroot,
      immutableMerkleRoot: blockInfo.immutablemerkleroot,
      previousBlock: blockInfo.previousblockhash,
      nextBlock: blockInfo.nextblockhash
    });
  } catch (err) {
    if (err.code === -5) {
      res.status(404).send('Block not found.');
    } else {
      logger.error(
        `Error retrieving information for block  - ${blockHash}. Error Message - ${err.message}`
      );
    }
  }
});

// bitcoin-cli getblock ${blockHash} 0
app.get('/block/:blockHash/raw', async (req, res) => {
  const blockHash = req.params.blockHash;

  if (!isHash(blockHash)) {
    logger.error(`Invaid block hash(${blockHash}) - /block/${blockHash}/raw`);
    res.status(400).send('Bad request');
    return;
  }

  try {
    const blockInfo = await tapyrusd.getBlock(blockHash, 0);

    res.json(blockInfo);
  } catch (error) {
    logger.error(
      `Error retrieving raw data for block  - ${blockHash}. Error Message - ${error.message}`
    );
  }
});

app.get('/block/:blockHash/txns', async (req, res) => {
  const blockHash = req.params.blockHash;
  const perPage = Number(req.query.perPage) || 25;
  const page = Number(req.query.page) || 1;

  if (!isHash(blockHash)) {
    logger.error(`Invaid block hash(${blockHash}) - /block/${blockHash}/txns`);
    res.status(400).send('Bad request');
    return;
  }

  try {
    const startIndex = (page - 1) * perPage;
    const txs = await rest.block.txs(blockHash, startIndex);
    txs.forEach(updateAddress);
    res.json(txs);
  } catch (error) {
    logger.error(
      `Error retrieving txns for block  - ${blockHash}. Error Message - ${error.message}`
    );
  }
});
