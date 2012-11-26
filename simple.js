var read = require('read');
var scrapi = require('scrapi');
var vm = require('vm');
var util = require('util');

// Create our scraping API. If there were more HTML to scrape,
// we'd flesh out the spec.
var simple = scrapi({
  base: 'https://simple.com',
  spec: { }
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
    // <script> tags on the page convolute sax-js too much.
    // For now, we'll use a stream instead and regex the relevant code.
    simple.stream('activity').get(function (err, text) {

      // Buffer and extract the code.
      var bufs = [];
      text.on('data', function (data) {
        bufs.push(data);
      }).on('end', function () {
        var text = String(Buffer.concat(bufs));

        // Extract the relevant <script>
        var script = text.match(/(window\.features[\s\S]*?)<\/script>/);
        script = script && script[1];

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
      })
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