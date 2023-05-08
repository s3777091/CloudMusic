'use strict';
const app = require('./app');
const sever = require('serverless-http');
module.exports.music = sever(app);