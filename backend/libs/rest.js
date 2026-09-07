const config = require('./config');
const { Metadata } = require('tapyrusjs-lib');

const baseUrl = `${config.rest.schema}://${config.rest.host}:${config.rest.port}`;

// Path segments are built from HTTP request values. Percent-encode them so that
// a value containing "/" cannot change which esplora endpoint is called.
// encodeURIComponent leaves "." untouched, so a value of exactly "." or ".."
// would still be resolved as a relative segment by the URL parser. Encode the
// dots in that case only, which keeps the URL of every other value unchanged.
const encodeSegment = value => {
  const encoded = encodeURIComponent(value);
  return encoded === '.' || encoded === '..'
    ? encoded.replace(/\./g, '%2E')
    : encoded;
};

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
  stats: async address =>
    fetchJson(`${baseUrl}/address/${encodeSegment(address)}`),
  txs: async (address, lastSeenTxid) => {
    const url = lastSeenTxid
      ? `${baseUrl}/address/${encodeSegment(address)}/txs/chain/${encodeSegment(lastSeenTxid)}`
      : `${baseUrl}/address/${encodeSegment(address)}/txs`;
    return fetchJson(url);
  },
  utxo: async address =>
    fetchJson(`${baseUrl}/address/${encodeSegment(address)}/utxo`)
};

const transaction = {
  get: async txid => fetchJsonOr404(`${baseUrl}/tx/${encodeSegment(txid)}`),
  raw: async txid => fetchTextOr404(`${baseUrl}/tx/${encodeSegment(txid)}/hex`),
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
  get: async blockHash =>
    fetchJsonOr404(`${baseUrl}/block/${encodeSegment(blockHash)}`),
  list: async startIndex =>
    fetchJson(`${baseUrl}/blocks/${encodeSegment(startIndex)}`),
  height: async height =>
    fetchTextOr404(`${baseUrl}/block-height/${encodeSegment(height)}`),
  raw: async blockHash =>
    fetchTextOr404(`${baseUrl}/block/${encodeSegment(blockHash)}/header`),
  status: async blockHash =>
    fetchJsonOr404(`${baseUrl}/block/${encodeSegment(blockHash)}/status`),
  tip: {
    height: async () => fetchJson(`${baseUrl}/blocks/tip/height`)
  },
  txs: async (blockHash, startIndex) => {
    const url = startIndex
      ? `${baseUrl}/block/${encodeSegment(blockHash)}/txs/${encodeSegment(startIndex)}`
      : `${baseUrl}/block/${encodeSegment(blockHash)}/txs`;
    return fetchJson(url);
  }
};

const color = {
  list: async lastSeenColorId => {
    const url = lastSeenColorId
      ? `${baseUrl}/colors/${encodeSegment(lastSeenColorId)}`
      : `${baseUrl}/colors`;
    return fetchJson(url);
  },
  get: async colorId => fetchJson(`${baseUrl}/color/${encodeSegment(colorId)}`),
  txs: async (colorId, lastSeenTxid) => {
    const url = lastSeenTxid
      ? `${baseUrl}/color/${encodeSegment(colorId)}/txs/chain/${encodeSegment(lastSeenTxid)}`
      : `${baseUrl}/color/${encodeSegment(colorId)}/txs`;
    return fetchJson(url);
  }
};

const mempool = {
  list: async startIndex => {
    const url = startIndex
      ? `${baseUrl}/mempool/txs/${encodeSegment(startIndex)}`
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
    try {
      const entry = await Metadata.fetch(colorId, config.networkId);
      return entry.metadata.toObject();
    } catch (error) {
      if (error.message?.includes('404')) {
        return null;
      }
      throw error;
    }
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
