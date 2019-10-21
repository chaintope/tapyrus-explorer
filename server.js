'use strict';

const jayson   =  require('jayson/promise');
const express  =  require('express')
const app      =  express()

const client = jayson.client.tcp({
  port : 60401
});


app.get('/block_header', async (req, res) => {
  const { result, error } = await client.request('blockchain.block.header',[2,0]);
  if(error) throw error;
  console.log(result);
  //console.log(error);
  res.json(result);
});

app.get('/estimate_fee', async (req, res) => {
  const { result, error } = await client.request('blockchain.estimatefee',[2]);
  if(error) throw error;
  console.log(result);
  //console.log(error);
  res.json(result);
});

app.get('/block_headers', async (req, res) => {
  const { result, error } = await client.request('blockchain.block.headers',[0,1,2]);
  if(error) throw error;
  console.log(result);
  //console.log(error);
  res.json(result);
});

app.get('/transaction_get', async (req, res) => {
  const { result, error } = await client.request('blockchain.transaction.get',[2,2]);
  if(error) throw error;
  console.log(result);
  //console.log(error);
  res.json(result);
});


app.get('/block_list', (req, res) => {
  client.request('blockchain.headers.subscribe',[],function(error, result){
    let height = result.result.height;
    let count = 25;
    let start_height = height - count;
    let displayList = "";
    client.request('blockchain.block.headers',[start_height,count,0],function(error, result){
      let output = result.result.hex.match(/.{160}/g);
      for( let i=0; i<count; i++){
        displayList += (height-i) + " : " + output[i] + "\n";
      }
      console.log(displayList);
      res.end(displayList);
    });

  });
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))
