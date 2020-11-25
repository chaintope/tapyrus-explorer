const app = require('../app.js');
const electrs = require('../libs/electrs');
const logger = require('../libs/logger');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/address/:address', async (req, res) => {
  let perPage = Number(req.query.perPage);
  const page = Number(req.query.page);

  const regex = new RegExp(/^[0-9a-zA-Z]{26,35}$/);
  const urlAddress = req.params.address;

  if (!regex.test(urlAddress)) {
    logger.error(`Regex Test didn't pass for URL - /address/${urlAddress}`);

    res.status(400).send('Bad request');
    return;
  }

  try {
    const scriptHash = electrs.convertToScriptHash(urlAddress);
    const balances = await electrs.blockchain.scripthash.get_balance(
      scriptHash
    );
    const balance = (balances && balances[0] && balances[0].confirmed) || 0;

    const addressTxsCount = 0;

    let startFromTxs = addressTxsCount - perPage * page + 1;
    if (startFromTxs < 0) {
      //if last page's remainder should use different value of startFromBlock and perPage
      startFromTxs = 0;
      perPage = (addressTxsCount + 1) % perPage;
    }

    const transactions = [];
    const receivedTapyrus = balance;

    res.json([
      balance,
      transactions.sort((tx1, tx2) => tx2.time - tx1.time),
      receivedTapyrus,
      0
    ]);
  } catch (error) {
    logger.error(
      `Error retrieving information for addresss - ${urlAddress}. Error Message - ${error.message}`
    );
  }
});
