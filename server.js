'use strict';

const jayson   =  require('jayson/promise');
const express  =  require('express')
const app      =  express()

const client = jayson.client.tcp({
  port : 60401
});


app.get('/block_header', async (req, res) => {
  const { result, error } = await client.request('blockchain.block.header',[2,4]);
  if(error) throw error;
  console.log(result);
  console.log(error);
  res.json(result);
});

app.get('/estimate_fee', async (req, res) => {
  const { result, error } = await client.request('blockchain.estimatefee',[2]);
  if(error) throw error;
  console.log(result);
  console.log(error);
  res.json(result);
});

app.get('/block_headers', async (req, res) => {
  const { result, error } = await client.request('blockchain.block.headers',[1,3,4]);
  if(error) throw error;
  console.log(result);
  console.log(error);
  res.json(result);
});

app.get('/transaction_get', async (req, res) => {
  const { result, error } = await client.request('blockchain.transaction.get',[2,2]);
  if(error) throw error;
  console.log(result);
  console.log(error);
  res.json(result);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
