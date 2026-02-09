const defaultConfig = {
  network: process.env.TAPYRUS_NETWORK || 'prod',
  networkId: process.env.NETWORK_ID || '1939510133',
  rest: {
    schema: process.env.ELECTRS_REST_SCHEMA || 'http',
    host: process.env.ELECTRS_REST_HOST || 'localhost',
    port: process.env.ELECTRS_REST_PORT || 3000
  },
  tokenRegistry: {
    baseUrl:
      process.env.TOKEN_REGISTRY_URL ||
      'https://chaintope.github.io/tapyrus-token-registry/tokens'
  }
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
