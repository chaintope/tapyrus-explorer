const defaultConfig = {
  network: process.env.TAPYRUS_NETWORK || 'prod',
  electrs: {
    host: process.env.ELECTRS_RPC_HOST || 'localhost',
    port: process.env.ELECTRS_RPC_PORT || 50001
  },
  rest: {
    schema: process.env.ELECTRS_REST_SCHEMA || 'http',
    host: process.env.ELECTRS_REST_HOST || 'localhost',
    port: process.env.ELECTRS_REST_PORT || 3000
  }
};

let config = defaultConfig;
try {
  const environment = require('../environments/environment');
  const environmentConfig = require(environment.CONFIG);

  config = Object.assign({}, defaultConfig, environmentConfig);
} catch (_) {
  config = defaultConfig;
}

module.exports = config;
