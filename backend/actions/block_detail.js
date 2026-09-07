const app = require('../app.js');
const logger = require('../libs/logger');
const rest = require('../libs/rest');
const {
  isHash,
  isBlockHeight,
  forLog,
  parseStartIndex,
  updateAddress
} = require('../libs/util');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/api/block/height/:height', async (req, res) => {
  const height = req.params.height;

  if (!isBlockHeight(height)) {
    logger.error(
      `Invalid block height(${forLog(height)}) - /block/height/${forLog(height)}`
    );
    res.status(400).send('Invalid block height.');
    return;
  }

  try {
    const blockHash = await rest.block.height(height);
    const block = await rest.block.get(blockHash);
    const status = await rest.block.status(blockHash);
    if (!block || !status) {
      res.status(404).send('Block not found.');
      return;
    }
    const tip = await rest.block.tip.height();
    res.json({
      blockHash: block.id,
      confirmations: tip - block.height,
      ntx: block.tx_count,
      height: block.height,
      timestamp: block.time,
      proof: block.signature,
      sizeBytes: block.size,
      version: block.features,
      merkleRoot: block.merkle_root,
      immutableMerkleRoot: block.im_merkle_root,
      previousBlock: block.previousblockhash,
      nextBlock: status.next_best
    });
  } catch (err) {
    logger.error(
      `Error retrieving information for block  - height = ${height}. Error Message - ${err.message}`
    );
    res.status(503).send('Service Temporary Unavailable');
  }
});

app.get('/api/block/:blockHash', async (req, res) => {
  const blockHash = req.params.blockHash;

  if (!isHash(blockHash)) {
    logger.error(`Invalid block hash(${blockHash}) - /block/${blockHash}`);
    res.status(400).send('Invalid block hash.');
    return;
  }

  try {
    const block = await rest.block.get(blockHash);
    const status = await rest.block.status(blockHash);
    if (!block || !status) {
      res.status(404).send('Block not found.');
      return;
    }
    const tip = await rest.block.tip.height();
    res.json({
      blockHash: block.id,
      confirmations: tip - block.height,
      ntx: block.tx_count,
      height: block.height,
      timestamp: block.time,
      proof: block.signature,
      sizeBytes: block.size,
      version: block.features,
      merkleRoot: block.merkle_root,
      immutableMerkleRoot: block.im_merkle_root,
      previousBlock: block.previousblockhash,
      nextBlock: status.next_best
    });
  } catch (err) {
    logger.error(
      `Error retrieving information for block  - ${blockHash}. Error Message - ${err.message}`
    );
    res.status(503).send('Service Temporary Unavailable');
  }
});

// bitcoin-cli getblock ${blockHash} 0
app.get('/api/block/:blockHash/raw', async (req, res) => {
  const blockHash = req.params.blockHash;

  if (!isHash(blockHash)) {
    logger.error(`Invalid block hash(${blockHash}) - /block/${blockHash}/raw`);
    res.status(400).send('Bad request');
    return;
  }

  try {
    const block = await rest.block.raw(blockHash);
    res.json({ hex: block });
  } catch (error) {
    logger.error(
      `Error retrieving raw data for block  - ${blockHash}. Error Message - ${error.message}`
    );
    res.status(503).send('Service Temporary Unavailable');
  }
});

app.get('/api/block/:blockHash/txns', async (req, res) => {
  const blockHash = req.params.blockHash;

  if (!isHash(blockHash)) {
    logger.error(`Invalid block hash(${blockHash}) - /block/${blockHash}/txns`);
    res.status(400).send('Bad request');
    return;
  }

  const pagination = parseStartIndex(req.query.page);
  if (!pagination) {
    logger.error(
      `Invalid page(${forLog(req.query.page)}) - /block/${blockHash}/txns`
    );
    res.status(400).send('Bad request');
    return;
  }
  const { startIndex } = pagination;

  try {
    const txs = await rest.block.txs(blockHash, startIndex);
    txs.forEach(updateAddress);
    res.json(txs);
  } catch (error) {
    logger.error(
      `Error retrieving txns for block  - ${blockHash}. Error Message - ${error.message}`
    );
    res.status(503).send('Service Temporary Unavailable');
  }
});
