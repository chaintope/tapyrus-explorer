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

const transaction = {
  get: async txid => {
    const url = `${baseUrl}/tx/${txid}`;
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else if (response.status === 404) {
      return null;
    } else {
      throw new Error(`failed to fetch API ${url}`);
    }
  },
  raw: async txid => {
    const url = `${baseUrl}/tx/${txid}/hex`;
    const response = await fetch(url);
    if (response.ok) {
      return response.text();
    } else if (response.status === 404) {
      return null;
    } else {
      throw new Error(`failed to fetch API ${url}`);
    }
  }
};

const block = {
  tip: {
    height: async () => {
      const url = `${baseUrl}/blocks/tip/height`;
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`failed to fetch API ${url}`);
      }
    }
  }
};
module.exports = {
  address,
  transaction,
  block
};
