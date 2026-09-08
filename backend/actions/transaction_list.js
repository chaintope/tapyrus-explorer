const app = require('../app.js');
const logger = require('../libs/logger');
const rest = require('../libs/rest');
const { forLog, parseStartIndex } = require('../libs/util');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

//Return a List of transactions
app.get('/api/transactions', async (req, res) => {
  const pagination = parseStartIndex(req.query.page);
  if (!pagination) {
    logger.error(`Invalid page(${forLog(req.query.page)}) - /transactions`);
    res.status(400).send('Bad request');
    return;
  }
  const { page, startIndex } = pagination;

  try {
    const result = await rest.mempool.list(startIndex);
    res.json({
      results: result.txs,
      txCount: result.count
    });
  } catch (error) {
    logger.error(
      `Error retrieving transactions for page#${page}. Error Message - ${error.message}`
    );
    res.status(500).send('Error Retrieving transactions');
  }
});
