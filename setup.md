# Setup

## Local environment

### Tapyrusd

The following settings need to be added to the configuration file:

```
rpcworkqueue=32
rpcthreads=16
```

Run tapyrusd
```bash
$ sudo ./src/tapyrusd -datadir=/var/lib/tapyrus-testnet -conf=/etc/tapyrus/tapyrus.conf 
```

### Esplora Tapyrus

Current implementation uses esplora-tapyrus. Example of build and run in command line:

```bash
$ cargo build --release
```

```bash
$ cargo run --release -- -vvvv --index-batch-size=10 --jsonrpc-import --db-dir ./db --electrum-rpc-addr="127.0.0.1:50001" --daemon-dir /var/lib/tapyrus-testnet/prod-1939510133/ --network-id 1939510133  --txid-limit=0
```

### Tapyrus explorer

Consists of backend (calling Esplora-Tapyrus to get data) and frontend

To setup dev and prod environment, create files

* /backend/configurations/dev.json
* /backend/configurations/prod.json

these files will only appear in your local. Eg.

```json
{
  "network": "prod",
  "rest": {
    "schema": "http",
    "host": "localhost",
    "port": 3000
  }
}
```

To setup backend, from `/backend`, run:

```bash
$ npm install
$ npm run setup
```

To start backend, from `/backend`, run:

```bash
$ npm start
```

To update cache manually, from `/backend`, run:
```bash
$ npm run setup
```

To test backend, first update cache and then run tests from `/backend` :

```bash
$ npm run setup
$ npm run test
```

Backend environment can be changed before you run `npm start` or `npm deploy` by changing the ENV to `'dev'` or `'prod'` in the package.json file as below

```json
  "scripts": {
    "prestart": "cross-env ENV='dev' node ./script.js", 
    "predeploy": "cross-env ENV='prod' node ./script.js"
  },
```

To start frontend, Run:

Set configuration file if you need. So far, it can configure parameters like below.

```json
{
  "backendUrl": "https://some.tapyrusexploler.example.com/api",
  "project": "Testnet"
}
```

* backendUrl: Backend API server URL.
* project: The project name displayed in the upper left of the screen.

Then put this json as `frontend/src/assets/config.json'. After this you can start frontend server like below.

```bash
$ cd frontend; ionic serve;
```
