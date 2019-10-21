'use strict';

const jayson   =  require('jayson/promise');
const express  =  require('express')
const app      =  express()
const exec     =  require('child_process').exec;

const client = jayson.client.tcp({
  port : 60401
});

app.get('/lenovo', async (req, res) => {
  let COMMAND = 'bitcoin-cli getblockhash 277';
  exec(COMMAND, function(error, stdout, stderr){
    if(error !== null){
      console.log('exec error: ' + error);
      return;
    }
    console.log('block hash: ' + stdout);
    COMMAND = 'bitcoin-cli getblock ' + stdout;
    // getblock contents exe
    exec(COMMAND, function(error, stdout, stderr){
      if(error !== null){
        console.log('exec error: ' + error);
        return;
      }
      //console.log('block contents: ' + stdout);
      let obj = JSON.parse(stdout);
      console.log('size : ' + obj.size);
      res.end('size : ' + obj.size);

    }); 
  });
});


app.get('/block_list', (req, res) => {
  client.request('blockchain.headers.subscribe',[],function(error, result){
    let height = result.result.height;
    let count = 25;
    let start_height = height - count;
    let displayList = "";
    let sizeList = "";
   
    client.request('blockchain.block.headers',[start_height,count,0],function(error, result){
      let output = result.result.hex.match(/.{160}/g);
      for( let i=0; i<count; i++){
        displayList += (height-i) + " : " + output[i] + " : "  + "\n";
      }
      console.log(displayList);
      //res.end(displayList);
    });
  });
});

app.listen(3000, () => console.log('Listening on port 3000!'))
