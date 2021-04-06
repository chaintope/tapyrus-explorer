const app = require('./app.js');
require('./actions/block_detail.js');
require('./actions/block_list.js');
require('./actions/color_detail.js');
require('./actions/transaction_detail.js');
require('./actions/transaction_list.js');
require('./actions/address_detail.js');

app.listen(3001, () => console.log('Listening on port 3001!'));

module.exports = app;
