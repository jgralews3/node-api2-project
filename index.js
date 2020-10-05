const express = require('express');
const expressRouter = require('./data/ExpressRouter');

const server = express();
const port = 5000;
const database = require('./data/db')

server.use(express());
server.use(expressRouter)

server.listen(port, ()=>{
    console.log(`Server running on port`, port)
})