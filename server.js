'use strict';

const jayson   =  require('jayson/promise');
const express  =  require('express')
const app      =  express()
const exec     =  require('child_process').exec;
const execSync =  require('child_process').execSync;

const client = jayson.client.tcp({
  port : 60401
});


//function blockSize(blockhight){
//  let COMMAND = 'bitcoin-cli getblockhash ' + blockhight;
//  exec(COMMAND, function(error, result){
//    if(error !== null) { console.log('exec error: ' + error); return; }
//    COMMAND = 'bitcoin-cli getblock ' + result;
//    exec(COMMAND, function(error, result){
//      if(error !== null) { console.log('exec error: ' + error); return; }
//      let blockInfo = JSON.parse(result);
//      //return blockInfo.size;
//    });
//    console.log(blockInfo);
//  });
//}


let blockSize = function(height, callback, callback2){
  let blockHash = callback(height);
  let result = callback2(blockHash);
  return result;
};

function getBlockHash(height){
  let COMMAND = 'bitcoin-cli getblockhash ' + height;
  let result  = execSync(COMMAND).toString();
  return result;
}

function getBlock(blockHash){
  let COMMAND = 'bitcoin-cli getblock ' + blockHash;
  let result = execSync(COMMAND).toString();
  result = JSON.parse(result);
  return result.size;
}

app.get('/block_list', (req, res) => {
  client.request('blockchain.headers.subscribe',[],function(error, result){
    let height = result.result.height;
    let count = 25;
    let start_height = height - count;
    let displayList = "";

    //blockSize(height, getBlockHash, getBlock); 
    client.request('blockchain.block.headers',[start_height,count,0],function(error, result){
      let output = result.result.hex.match(/.{160}/g);
      for( let i=0; i<count; i++){
        displayList += (height-i) + " : " + output[i] + " : " + blockSize((height-i), getBlockHash, getBlock)  + "\n";
      }
      console.log(displayList);
      res.end(displayList);
    });
  });
});

app.listen(3000, () => console.log('Listening on port 3000!'))
