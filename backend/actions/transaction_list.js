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

//Return a List of transactions
app.get('/transactions', async (req, res) => {
  let perPage = Number(req.query.perPage);
  const page = Number(req.query.page);

  try {
    const startIndex = (page - 1) * perPage;
    const result = await rest.mempool.list(startIndex);
    res.json({
      results: result.txs,
      txCount: result.count
    });
  } catch (error) {
    logger.error(
      `Error retrieving ${perPage} transactions for page#${page}. Error Message - ${error.message}`
    );
    res.status(500).send('Error Retrieving transactions');
  }
});
