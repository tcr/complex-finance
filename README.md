# complex-finance

A complicated interface to your Simple Finance account.

## module

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

## test

```
$ node simple.js
Username: your_username
Passphrase: 
{ balances: 
   { total: ...,
     safe_to_spend: ...,
     bills: 0,
     deposits: 0,
     pending: 0,
     goals: 0 },
  timestamp: { timestamp: ... },
  Transactions: 
   [ ... ],
  User: 
   { ... },
  fundingAttempts: 
   [ ... ],
  Chats: 
   [ ... ],
  ChatsStatus: 
   { ... },
  Goals: [],
  PaymentRequests: [],
  Payments: [] }
```