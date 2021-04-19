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
  get: async blockHash => {
    const url = `${baseUrl}/block/${blockHash}`;
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else if (response.status === 404) {
      return null;
    } else {
      throw new Error(`failed to fetch API ${url}`);
    }
  },
  list: async startIndex => {
    const url = `${baseUrl}/blocks/${startIndex}`;
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`failed to fetch API ${url}`);
    }
  },
  height: async height => {
    const url = `${baseUrl}/block-height/${height}`;
    const response = await fetch(url);
    if (response.ok) {
      return response.text();
    } else if (response.status === 404) {
      return null;
    } else {
      throw new Error(`failed to fetch API ${url}`);
    }
  },
  raw: async blockHash => {
    const url = `${baseUrl}/block/${blockHash}/header`;
    const response = await fetch(url);
    if (response.ok) {
      return response.text();
    } else if (response.status === 404) {
      return null;
    } else {
      throw new Error(`failed to fetch API ${url}`);
    }
  },
  status: async blockHash => {
    const url = `${baseUrl}/block/${blockHash}/status`;
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else if (response.status === 404) {
      return null;
    } else {
      throw new Error(`failed to fetch API ${url}`);
    }
  },
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
  },
  txs: async (blockHash, startIndex) => {
    let url;
    if (startIndex) {
      url = `${baseUrl}/block/${blockHash}/txs/${startIndex}`;
    } else {
      url = `${baseUrl}/block/${blockHash}/txs`;
    }
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`failed to fetch API ${url}`);
    }
  }
};

const color = {
  get: async colorId => {
    const url = `${baseUrl}/color/${colorId}`;
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`failed to fetch API ${url}`);
    }
  },
  txs: async (colorId, lastSeenTxid) => {
    let url;
    if (lastSeenTxid) {
      url = `${baseUrl}/color/${colorId}/txs/chain/${lastSeenTxid}`;
    } else {
      url = `${baseUrl}/color/${colorId}/txs`;
    }
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`failed to fetch API ${url}`);
    }
  }
};

const mempool = {
  list: async startIndex => {
    let url;
    if (startIndex) {
      url = `${baseUrl}/mempool/txs/${startIndex}`;
    } else {
      url = `${baseUrl}/mempool/txs`;
    }
    const response = await fetch(url);
    if (response.ok) {
      return {
        count: response.headers.get('X-Total-Results'),
        txs: await response.json()
      };
    } else {
      throw new Error(`failed to fetch API ${url}`);
    }
  }
};

module.exports = {
  address,
  transaction,
  block,
  color,
  mempool
};
