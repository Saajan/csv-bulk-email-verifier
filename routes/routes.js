'using strict';

const dns = require('dns');
var csv = require('csv-parser');
var emailExistence = require('email-existence');
var verify = require('../module/bulk-email-verifier');
var SERVERS = ['8.8.8.8', '81.218.119.11', '195.46.39.39', '96.90.175.167', '208.76.50.50', '216.146.35.35', '37.235.1.174', '198.101.242.72', '77.88.8.8', '91.239.100.100', '74.82.42.42', '109.69.8.51', '	209.244.0.3', '64.6.64.6'];
var SERVERS_LENGTH = SERVERS.length;
var SERVER_COUNT = 0;

module.exports = function (express, app, fs, _, io) {
  var router = express.Router();
  require('events').EventEmitter.defaultMaxListeners = Infinity;
  router.post('/upload', function (req, res, next) {
    var sampleFile;
    if (!req.files) {
      res.send('No files were uploaded.');
      return;
    }
    sampleFile = req.files.sampleFile;
    sampleFile.mv('public/dist/static/email.csv', function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        var domains = [];
        var emails = [];
        fs.createReadStream('public/dist/static/email.csv')
          .pipe(csv())
          .on('data', function (data) {
            emails.push(data.Emails);
            // console.log(data);
            domains.push((data.Emails).split('@')[1]);
          }).on('end', function () {
            _isValidDomainMX(emails, domains);
          });
      }
      res.render('upload', {
        helpers: {}
      });
    });
  });

  router.get('/', function (req, res, next) {
    res.render('index', {
      helpers: {}
    });
  });

  app.use('/', router);
};

const _isValidDomainMX = (domains, emails) => {
  // Get the MX Records to find the SMTP server
  // function to resolve mx records
  // loops through emails and launches parallel requests - rate limit as required
  // console.log(domains);
  // domains.forEach(function(domain) {
  // var nextServer = SERVERS[SERVER_COUNT % SERVERS_LENGTH];
  //  console.log(nextServer);
  //  dns.setServers([nextServer]);
  //  SERVER_COUNT++;
  //  dns.resolveMx(domain, (err, addresses) => {
  // console.log(domain, err, addresses);
  //    if (err || (typeof addresses === 'undefined')) {
  //      console.log('invalid - No MX Records', domain, addresses);
  //     } else if (addresses && addresses.length <= 0) {
  //       console.log('invalid - No MX Records', domain, addresses);
  //    } else {
  // Valid Domain, MX Record Found
  //      console.log('MX Records-verfied', domain, addresses);
  //   }
  //  });
  // });
  dns.resolveMx('saajan.sn@gmail.com', (error, addresses) => { console.error(error); console.log(addresses); });
  domains.forEach(function (domain,index) {
    //verify.verifyEmails(domain, emails[index], {}, function (err, data) {
      //console.log(data);
    //});

    //emailExistence.check(emails[index], function(error, response){
        //console.log('res: '+response);
    //});

    
  });
};
