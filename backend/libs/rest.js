const config = require('./config');
const logger = require('./logger');
const { Metadata } = require('tapyrusjs-lib');

const baseUrl = `${config.rest.schema}://${config.rest.host}:${config.rest.port}`;

// Path segments are built from HTTP request values. Percent-encode them so that
// a value containing "/" cannot change which esplora endpoint is called.
//
// "." and ".." cannot be dealt with by encoding. The URL parser reads a segment
// as a relative one when it matches "." or ".." with the dots written either
// literally or as %2e (WHATWG URL, single-dot and double-dot path segment), so
// every encoding of them resolves the same way the bare value does. They are
// refused instead.
//
// Every entry point validates its values before they reach here, so this is the
// layer that still holds if one of them stops doing so. Throwing surfaces that
// as a fault of the backend, which is what it would be; each caller runs inside
// a handler that answers 500.
const encodeSegment = value => {
  const segment = String(value);
  if (segment === '.' || segment === '..') {
    throw new Error(`invalid path segment (${segment})`);
  }
  return encodeURIComponent(segment);
};

const BROADCAST_TIMEOUT_MS = 10000;

// Posts a transaction to one esplora. Never throws: `rejected` separates a
// node that refused the transaction (a 4xx answer) from one that could not
// judge it (timeout, connection failure, a 5xx answer), since only the former
// says something about the transaction itself.
const postTx = async (url, rawTxHex) => {
  try {
    const response = await fetch(`${url}/tx`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: rawTxHex,
      signal: AbortSignal.timeout(BROADCAST_TIMEOUT_MS)
    });
    const text = await response.text();
    if (response.ok) {
      return { ok: true, txid: text };
    }
    return {
      ok: false,
      rejected: response.status >= 400 && response.status < 500,
      message: text || 'failed to broadcast transaction'
    };
  } catch (error) {
    return { ok: false, rejected: false, message: error.message };
  }
};

// Posts a transaction to every node and answers with the first success, so a
// node that is down only delays the answer when no node accepts it. The posts
// that are still running carry on in the background so that every node gets
// the transaction. A transaction spending it may still reach a node before
// that post does and be refused there, but the node that accepted first
// accepts it, which is enough for the broadcast to succeed.
//
// When every node fails, a refusal is reported over a failure to judge the
// transaction, the first one in the configured order. The message is passed to
// the client as it is, so the node URLs, which are internal addresses, stay in
// the log.
const broadcastToAll = (urls, rawTxHex) => {
  const posts = urls.map(url => postTx(url, rawTxHex));

  return new Promise((resolve, reject) => {
    posts.forEach(post =>
      post.then(result => {
        if (result.ok) {
          resolve(result.txid);
        }
      })
    );

    Promise.all(posts).then(results => {
      results.forEach((result, i) => {
        if (!result.ok) {
          logger.warn(
            `Failed to broadcast transaction to ${urls[i]}. Error Message - ${result.message}`
          );
        }
      });
      if (results.some(result => result.ok)) {
        return;
      }
      const reported = results.find(result => result.rejected) || results[0];
      reject(new Error(reported.message));
    });
  });
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
    if (config.broadcastUrls.length > 0) {
      return broadcastToAll(config.broadcastUrls, rawTxHex);
    }
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
