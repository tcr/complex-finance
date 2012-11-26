#!/usr/bin/env node

var path = require('path');

var simple = require('./');
var read = require('read');
var nconf = require('nconf');
var osenv = require('osenv');

nconf.file(path.join(osenv.home(), '.simpleconf'));

function login (next) {
  read({ prompt: 'Username: ' }, function (err, username) {
    nconf.set('username', username);
    read({ prompt: 'Password: ', silent: true }, function (err, password) {
      nconf.set('password', password);
      authenticate(next);
    });
  });
}

function authenticate (next) {
  simple.authenticate(nconf.get('username'), nconf.get('password'), function (err) {
    if (err) {
      console.error('Invalid credentials. Please login again.');
      process.exit(1);
    }
    next();
  });
}

switch (process.argv[2]) {
  case 'login':
    login(function () {
      console.error('Logged in successfully.');
    });
    break;

  case 'balances':
    authenticate(function () {
      simple.balances(function (err, json) {
        console.log('Total:\t\t', '$' + json.total/10000);
        console.log('Safe-to-spend:\t', '$' + json.safe_to_spend/10000);
      })
    });
    break;

  default:
    console.error('Usage: simple (login | balances)');
    process.exit(1);
    break;
}