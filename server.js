const express = require('express');

const accounts = require('./accounts/accounts-router')

const server = express();

server.use(express.json());
server.use('/api/accounts', accounts)

module.exports = server;