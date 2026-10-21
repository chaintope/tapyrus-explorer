const assert = require('assert');

describe('config', () => {
  describe('broadcastUrls', () => {
    const configPath = require.resolve('../../libs/config');
    let originalEnv;
    let originalModule;

    // Other modules hold the config object they loaded. Putting it back keeps a
    // later require() returning that same object.
    before(() => {
      originalModule = require.cache[configPath];
    });

    after(() => {
      require.cache[configPath] = originalModule;
    });

    // The URLs are read from the environment when the module is loaded, so
    // each case loads it afresh.
    const loadWith = value => {
      if (value === undefined) {
        delete process.env.ELECTRS_BROADCAST_URLS;
      } else {
        process.env.ELECTRS_BROADCAST_URLS = value;
      }
      delete require.cache[configPath];
      return require('../../libs/config');
    };

    beforeEach(() => {
      originalEnv = process.env.ELECTRS_BROADCAST_URLS;
    });

    afterEach(() => {
      loadWith(originalEnv);
    });

    it('should be empty when the variable is not set', () => {
      assert.deepStrictEqual(loadWith(undefined).broadcastUrls, []);
    });

    it('should be empty when the variable is empty', () => {
      assert.deepStrictEqual(loadWith('').broadcastUrls, []);
    });

    it('should split the URLs and drop blanks and empty entries', () => {
      assert.deepStrictEqual(
        loadWith(' http://10.0.0.1:5001 ,, http://10.0.0.2:5001,')
          .broadcastUrls,
        ['http://10.0.0.1:5001', 'http://10.0.0.2:5001']
      );
    });

    // A trailing slash would make the request path "//tx".
    it('should drop trailing slashes', () => {
      assert.deepStrictEqual(
        loadWith('http://10.0.0.1:5001/,http://10.0.0.2:5001//').broadcastUrls,
        ['http://10.0.0.1:5001', 'http://10.0.0.2:5001']
      );
    });

    it('should refuse a URL without a scheme', () => {
      assert.throws(
        () => loadWith('http://10.0.0.1:5001,10.0.0.2:5001'),
        /ELECTRS_BROADCAST_URLS must be http or https URLs \(10\.0\.0\.2:5001\)/
      );
    });

    it('should refuse a scheme other than http or https', () => {
      assert.throws(
        () => loadWith('localhost:5001'),
        /ELECTRS_BROADCAST_URLS must be http or https URLs/
      );
    });

    it('should accept https', () => {
      assert.deepStrictEqual(
        loadWith('https://esplora.example').broadcastUrls,
        ['https://esplora.example']
      );
    });
  });
});
