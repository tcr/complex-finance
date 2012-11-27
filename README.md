# complex-finance

A Simple Finance API!

## Module

`npm install complex-finance`

and simply

```javascript
var simple = require('complex-finance')
simple.authenticate(username, password, function (err) {
  // if !err, you can make authenticated calls
  simple.dashboard(function (err, dashboard) { }); // all your information
  simple.user(function (err, user) { }); // profile information
  simple.balances(function (err, balances) { }); // safe-to-spend, account balance, etc.
  simple.goals(function (err, goals) { });
  simple.transactions(function (err, transactions) { });
  simple.fundingAttempts(function (err, fundingAttempts) { });
  simple.payments(function (err, payments) { });
  simple.paymentRequests(function (err, paymentRequests) { });
});
```

## Command line: `simple`

`npm install -g complex-finance`

and simply

```
$ simple login
Username: ...
Password: ...
Logged in.

$ simple balances
Total:           $200.00
Safe-to-spend:   $200.00

$ simple transactions

```

## License

MIT!