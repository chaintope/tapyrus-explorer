const app = require('../app.js');
const rest = require('../libs/rest');
const logger = require('../libs/logger');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/blocks', async (req, res) => {
  let perPage = Number(req.query.perPage);
  const page = Number(req.query.page);

  try {
    const bestBlockHeight = await rest.block.tip.height();
    const endIndex = perPage * page - 1; // genesis block has height 0.
    const startIndex = endIndex + 1 - perPage;

    const startBlock = bestBlockHeight - startIndex;
    let endBlock = startBlock - perPage + 1;
    if (endBlock < 0) {
      endBlock = 0;
    }

    const results = [];
    let currentIndex = startBlock;
    while (currentIndex >= endBlock) {
      const blocks = await rest.block.list(currentIndex);
      for (const block of blocks) {
        if (results.length < perPage) {
          results.push(block);
        }
      }
      currentIndex -= 10; // Esplora return 10 records in each call GET /blocks/
    }

    res.json({
      results: results,
      bestHeight: bestBlockHeight
    });
  } catch (err) {
    logger.error(
      `Error retrieving ${perPage} blocks for page#${page}. Error Message - ${err.message}`
    );
    res.status(500).send(`Error Retrieving Blocks`);
  }
});
