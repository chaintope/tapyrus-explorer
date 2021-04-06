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

app.get('/color/:colorId', async (req, res) => {
  const colorId = req.params.colorId;
  try {
    const stats = await rest.color.get(colorId);
    res.json(stats);
  } catch (error) {
    logger.error(
      `Error retrieving color stats  - ${colorId}. Error Message - ${error.message}`
    );
  }
});
