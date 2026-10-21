// A malformed URL would otherwise make every broadcast fail at request time.
// Refusing it here stops the backend at startup instead.
//
// The request path is made by appending "/tx", so a query or a fragment would
// end up in front of it ("http://host?x/tx") and is refused too.
const parseBroadcastUrls = value =>
  (value || '')
    .split(',')
    .map(url => url.trim().replace(/\/+$/, ''))
    .filter(url => url.length > 0)
    .map(url => {
      let protocol;
      try {
        protocol = new URL(url).protocol;
      } catch {
        protocol = null;
      }
      if (protocol !== 'http:' && protocol !== 'https:') {
        throw new Error(
          `ELECTRS_BROADCAST_URLS must be http or https URLs (${url})`
        );
      }
      if (/[?#]/.test(url)) {
        throw new Error(
          `ELECTRS_BROADCAST_URLS must not have a query or a fragment (${url})`
        );
      }
      return url;
    });

const defaultConfig = {
  network: process.env.TAPYRUS_NETWORK || 'prod',
  networkId: process.env.NETWORK_ID || '1939510133',
  rest: {
    schema: process.env.ELECTRS_REST_SCHEMA || 'http',
    host: process.env.ELECTRS_REST_HOST || 'localhost',
    port: process.env.ELECTRS_REST_PORT || 3000
  },
  // Base URLs of every esplora a transaction is broadcast to, comma separated.
  // When the REST host is a load balancer in front of several nodes, two
  // transactions posted one after the other can land on different nodes, and
  // the second is refused as "Missing inputs" by a node that has not yet
  // received the first. Posting to every node avoids that. Empty means the
  // REST host above.
  broadcastUrls: parseBroadcastUrls(process.env.ELECTRS_BROADCAST_URLS)
};

let config = defaultConfig;
try {
  const environment = require('../environments/environment');
  const environmentConfig = require(environment.CONFIG);

  config = Object.assign({}, defaultConfig, environmentConfig);
} catch {
  config = defaultConfig;
}

module.exports = config;
