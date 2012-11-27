var read = require('read');
var scrapi = require('scrapi');
var vm = require('vm');
var util = require('util');

// Create our scraping API. The /activity path
// has a massive <script> blob which contains the dashboard
// data. The scraper identifies and takes the body of this element.

var simple = scrapi({
  base: 'https://simple.com',
  spec: {
    'activity': {
      dashboard_data: '(text) #HelpModal + script'
    }
  }
});

// Create an API object to abstract our code.
var api = module.exports = {
  authenticate: function (username, password, next) {
    // Signin, using scrapi to store cookies.
    simple('signin').post({
      username: username,
      password: password
    }, function (err, json, media) {
      next(!!(media.res.headers['location'] || '').match(/signin$/));
    });
  },

  dashboard: function (next) {
    simple('activity').get(function (err, json) {
      // Extract the text body.
      var script = json.dashboard_data;

      // Create a VM to run the script in.
      if (script) {
        var vmctx = vm.createContext({
          window: {}
        });
        vm.runInContext(script, vmctx, 'simple.com');
        var dashboard = vmctx.window.butcherData;
      }

      // Finally we have our finance data!
      next(!script, dashboard);
    });
  },

  user: function (next) {
    this.dashboard(function (err, json) {
      next(err, json && json.User);
    });
  },

  balances: function (next) {
    this.dashboard(function (err, json) {
      next(err, json && json.balances);
    });
  },

  goals: function (next) {
    this.dashboard(function (err, json) {
      next(err, json && json.Goals);
    });
  },

  transactions: function (next) {
    this.dashboard(function (err, json) {
      next(err, json && json.Transactions);
    });
  },

  fundingAttempts: function (next) {
    this.dashboard(function (err, json) {
      next(err, json && json.fundingAttempts);
    });
  },

  paymentRequests: function (next) {
    this.dashboard(function (err, json) {
      next(err, json && json.PaymentRequests);
    });
  },

  payments: function (next) {
    this.dashboard(function (err, json) {
      next(err, json && json.Payments);
    });
  }
};

if (require.main == module) {
  // Prompt for username and password.
  read({prompt: 'Username: '}, function (err, username) {
    read({prompt: 'Passphrase: ', silent: true}, function (err, password) {
      api.authenticate(username, password, function (err) {
        if (err) {
          console.error('Invalid credentials.');
          process.exit(1);
        }

        // Log dashboard object.
        api.dashboard(function (err, dashboard) {
          console.log(util.inspect(dashboard));
        })
      })
    });
  });
}