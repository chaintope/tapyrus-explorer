# Tapyrus Explorer

Tapyrus block explorer. The Testnet explorer is available at:

https://testnet-explorer.tapyrus.dev.chaintope.com/

## How to run on your local environment.

### Run on docker!

You just run below command. It will start [Tapyrus Core](https://github.com/chaintope/tapyrus-core),
[Esplora Tapyrus](https://github.com/chaintope/esplora-tapyrus), application backend and frontend containers.
In the default setting, the tapyrus core container will connect to `tapyrus testnet` and start to download blocks.
After all the blocks are downloaded, you can start to use Tapyrus Explorer.

```
docker-compose up -d
```

Once the container is up and running, you can access the Explorer at `http://localhost:4200/`.

### Run on your local host!

see [setup.md](./setup.md)
