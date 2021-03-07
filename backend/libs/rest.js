const config = require('./config');
const fetch = require('node-fetch');

const baseUrl = `${config.rest.schema}://${config.rest.host}:${config.rest.port}`;
const address = {
  stats: async address => {
    const url = `${baseUrl}/address/${address}`;
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`failed to fetch API ${url}`);
    }
  },
  txs: async (address, lastSeenTxid) => {
    let url;
    if (lastSeenTxid) {
      url = `${baseUrl}/address/${address}/txs/chain/${lastSeenTxid}`;
    } else {
      url = `${baseUrl}/address/${address}/txs`;
    }
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`failed to fetch API ${url}`);
    }
  }
};

module.exports = {
  address
};
