'use strict';

const jayson   =  require('jayson/promise');
const express  =  require('express')
const app      =  express()
const exec     =  require('child_process').exec;

const client = jayson.client.tcp({
  port : 60401
});


function getBlockHash(height,callback){
  let COMMAND = 'bitcoin-cli getblockhash ' + height;
  exec(COMMAND, function(error, result){
    if(error !== null) { console.log('exec error: ' + error); return; }
    callback(result,returnResult);
  });
}

function getBlock(blockHash,callback){
  let COMMAND = 'bitcoin-cli getblock ' + blockHash;
  exec(COMMAND, function(error, result){
    if(error !== null) { console.log('exec error: ' + error); return; }
    let blockInfo = JSON.parse(result);
    callback(blockInfo);
  });
}


app.get('/block', (req, res) => {
  client.request('blockchain.headers.subscribe',[],function(error, result){
    let height = result.result.height;
    let count = 25;
    let start_height = height - count;
    let displayList = "";

    client.request('blockchain.block.headers',[start_height,count,0],function(error, result){
      let output = result.result.hex.match(/.{160}/g);
      getBlockHash(height, (hash) => {
        getBlock(hash, (blockInfo) => {
          res.json(blockInfo);
        });
      });
    });
  });
});

app.listen(3000, () => console.log('Listening on port 3000!'))
