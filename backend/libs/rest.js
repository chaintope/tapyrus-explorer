const config = require('./config');

const baseUrl = `${config.rest.schema}://${config.rest.host}:${config.rest.port}`;

// Helper functions
const fetchJson = async url => {
  const response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
  throw new Error(`failed to fetch API ${url}`);
};

const fetchJsonOr404 = async url => {
  const response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
  if (response.status === 404) {
    return null;
  }
  throw new Error(`failed to fetch API ${url}`);
};

const fetchTextOr404 = async url => {
  const response = await fetch(url);
  if (response.ok) {
    return response.text();
  }
  if (response.status === 404) {
    return null;
  }
  throw new Error(`failed to fetch API ${url}`);
};

const address = {
  stats: async address => fetchJson(`${baseUrl}/address/${address}`),
  txs: async (address, lastSeenTxid) => {
    const url = lastSeenTxid
      ? `${baseUrl}/address/${address}/txs/chain/${lastSeenTxid}`
      : `${baseUrl}/address/${address}/txs`;
    return fetchJson(url);
  },
  utxo: async address => fetchJson(`${baseUrl}/address/${address}/utxo`)
};

const transaction = {
  get: async txid => fetchJsonOr404(`${baseUrl}/tx/${txid}`),
  raw: async txid => fetchTextOr404(`${baseUrl}/tx/${txid}/hex`),
  broadcast: async rawTxHex => {
    const url = `${baseUrl}/tx`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: rawTxHex
    });
    if (response.ok) {
      return response.text();
    }
    const errorText = await response.text();
    throw new Error(errorText || `failed to broadcast transaction`);
  }
};

const block = {
  get: async blockHash => fetchJsonOr404(`${baseUrl}/block/${blockHash}`),
  list: async startIndex => fetchJson(`${baseUrl}/blocks/${startIndex}`),
  height: async height => fetchTextOr404(`${baseUrl}/block-height/${height}`),
  raw: async blockHash =>
    fetchTextOr404(`${baseUrl}/block/${blockHash}/header`),
  status: async blockHash =>
    fetchJsonOr404(`${baseUrl}/block/${blockHash}/status`),
  tip: {
    height: async () => fetchJson(`${baseUrl}/blocks/tip/height`)
  },
  txs: async (blockHash, startIndex) => {
    const url = startIndex
      ? `${baseUrl}/block/${blockHash}/txs/${startIndex}`
      : `${baseUrl}/block/${blockHash}/txs`;
    return fetchJson(url);
  }
};

const color = {
  list: async lastSeenColorId => {
    const url = lastSeenColorId
      ? `${baseUrl}/colors/${lastSeenColorId}`
      : `${baseUrl}/colors`;
    return fetchJson(url);
  },
  get: async colorId => fetchJson(`${baseUrl}/color/${colorId}`),
  txs: async (colorId, lastSeenTxid) => {
    const url = lastSeenTxid
      ? `${baseUrl}/color/${colorId}/txs/chain/${lastSeenTxid}`
      : `${baseUrl}/color/${colorId}/txs`;
    return fetchJson(url);
  }
};

const mempool = {
  list: async startIndex => {
    const url = startIndex
      ? `${baseUrl}/mempool/txs/${startIndex}`
      : `${baseUrl}/mempool/txs`;
    const response = await fetch(url);
    if (response.ok) {
      return {
        count: response.headers.get('X-Total-Results'),
        txs: await response.json()
      };
    }
    throw new Error(`failed to fetch API ${url}`);
  }
};

const tokenRegistry = {
  getMetadata: async colorId => {
    const registryBaseUrl = config.tokenRegistry.baseUrl;
    const networkId = config.networkId;
    const url = `${registryBaseUrl}/${networkId}/${colorId}.json`;
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }
    if (response.status === 404) {
      return null;
    }
    throw new Error(`failed to fetch token metadata ${url}`);
  }
};

module.exports = {
  address,
  transaction,
  block,
  color,
  mempool,
  tokenRegistry
};
