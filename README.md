# complex-finance

A complicated interface to your Simple Finance account.

## module

`npm install complex-finance`

and simply

```javascript
var simple = require('complex-finance')
simple.authenticate(username, password, function (err) {
  simple.finances(function (finances) {
    // a very large object with your dashboard information
  })
})
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