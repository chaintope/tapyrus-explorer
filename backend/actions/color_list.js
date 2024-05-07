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

app.get('/api/colors', async (req, res) => {
  const lastSeenColorId = req.query.lastSeenColorId;

  try {
    const colors = await rest.color.list(lastSeenColorId);
    res.json({ colors: colors });
  } catch (err) {
    logger.error(`Error retrieving colors. Error Message - ${err.message}`);
    res.status(500).send(`Error Retrieving Blocks`);
  }
});
