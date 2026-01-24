const compression = require('compression');
const express = require('express');

const app = express();

app.use(compression());
app.use(express.text({ type: 'text/plain' }));

module.exports = app;
