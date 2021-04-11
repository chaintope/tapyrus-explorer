const app = require('../app.js');
const tapyrusd = require('../libs/tapyrusd').client;
const logger = require('../libs/logger');
const rest = require('../libs/rest');
const { sortTxs } = require('../libs/util');

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
    let txns = Object.values(await tapyrusd.getRawMempool(true));
    txns = sortTxs(txns);

    const txCount = txns.length;
    const endIndex = perPage * page - 1;
    const startIndex = endIndex + 1 - perPage;
    const startTx = txCount - startIndex;
    let endTx = startTx - perPage + 1;
    if (endTx < 0) {
      endTx = 0;
    }

    const memTxList = [];
    for (let i = endTx; i < startTx; i++) {
      const tx = txns[i];
      const txInfo = await rest.transaction.get(txns[i].txid);
      tx.amount = txInfo.vin.reduce((sum, input) => {
        return sum + ((input.prevout || {}).value || 0);
      }, 0);
      memTxList.push(tx);
    }
    res.json({
      results: memTxList,
      txCount
    });
  } catch (error) {
    logger.error(
      `Error retrieving ${perPage} transactions for page#${page}. Error Message - ${error.message}`
    );
    res.status(500).send('Error Retrieving transactions');
  }
});
