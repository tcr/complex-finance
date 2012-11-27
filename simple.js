#!/usr/bin/env node

var path = require('path');

var simple = require('./');
var read = require('read');
var nconf = require('nconf');
var osenv = require('osenv');
var fx = require('money');
require('colors');

nconf.file(path.join(osenv.home(), '.simpleconf'));

function money(usd) {
  return '$' + Number(usd).toFixed(2);
}

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
  simple.authenticate(String(nconf.get('username')), String(nconf.get('password')), function (err) {
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
        console.log('Total:\t\t', money(json.total / 10000));
        console.log('Safe-to-spend:\t', money(json.safe_to_spend / 10000));
      })
    });
    break;

  case 'transactions':
    authenticate(function () {
      simple.transactions(function (err, json) {
        json.slice(0, 100).forEach(function (transaction, i) {
          console.log(('   ' + (i + 1) + '.').substr(-3).yellow, transaction.description);
          console.log(('               ' + money(transaction.amounts.amount / 10000)).substr(-10).green, '\t', String(new Date(transaction.times.when_recorded)).split(/\s+/).slice(1, 5).join(' ').green);
        })
      })
    });
    break;

  default:
    console.error('Usage: simple <command>')
    console.error('')
    console.error('  simple login');
    console.error('  simple balances');
    console.error('  simple transactions');
    process.exit(1);
    break;
}