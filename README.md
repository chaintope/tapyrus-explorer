# Tapyrus Explorer

Tapyrus block explorer. The Testnet explorer is available at:

https://testnet-explorer.tapyrus.dev.chaintope.com/

## How to run on your local environment.

### Run on docker!

Using docker-compose, you can easily start [Tapyrus Core](https://github.com/chaintope/tapyrus-core),
[Esplora Tapyrus](https://github.com/chaintope/esplora-tapyrus) and this explorer.

First, create an `.env` file and a `tapyrus.conf` file to configure the network on which the Explorer will run.
To connect to testnet, copy and create `.env.testnet` and `tapyrus_testnet.conf`, like:

    $ cp .env.testnet .env
    $ cp tapyrus_testnet.conf tapyrus.conf

Once the configuration file is ready, all that remains is to launch the service using docker-compose.

    $ docker-compose up -d

Once the container is up and running, you can access the Explorer at `http://localhost:4200/`.

### Run on your local host!

see [setup.md](./setup.md)
