'use strict';

const jayson   =  require('jayson');
const express  =  require('express')
const app      =  express()


app.get('/', (req, res) => {
  const todoList = [
    { ID: '1', BLOCK: 'kaheik91' },
    { ID: '2', BLOCK: 'kjfa832k' },
    { ID: '3', BLOCK: 'kkae7373' }
  ];
  res.json(todoList);
});

const client = jayson.client.tcp({
  port : 60401
});


app.get('/block_header', (req, res) => {
  client.request('blockchain.block.header',[2,2],function(err, response){
    if(err) throw err;
    var json = response.result;
    console.log(json.header); //only header information output
    res.json(json.header);  // only header information output:w
    //console.log(response.result);
    //res.json(response.result);
  });
});

//app.get('/estimate_fee', (req, res) => {
//  client.request('blockchain.estimatefee',[2],function(err, response){
//    if(err) throw err;
//    console.log(response.result);
//    res.json(response.result);
//  });
//});

//app.get('/block_headers', (req, res) => {
//  client.request('blockchain.block.headers',[1,3,4],function(err, response){
//    if(err) throw err;
//    console.log(response.result);
//    res.json(response.result);
//  });
//});


//app.get('/transaction_get', (req, res) => {
//  client.request('blockchain.transaction.get',[2,2],function(err, response){
//    if(err) throw err;
//    console.log(response.result);
//    res.json(response.result);
//  });
//});


app.listen(3000, () => console.log('Example app listening on port 3000!'))
