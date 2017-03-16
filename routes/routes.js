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

const _isValidDomainMX = (emails, domains) => {
  console.log("starting", domains.length);
  var time = 10000;
  setTimeout(function () {
    while (domains.length) {
      // console.log(a.splice(0, 10));
      callForCheckup(domains.splice(0, 10), emails.splice(0, 10));
    }
  }, time);
  time += 10000;
};

function callForCheckup(newDomains, newEmails) {
  newDomains.forEach(function (domain, index) {
    verify.verifyEmails(domain, newEmails[index], {}, function (err, data) {
      console.log('outside_' + index, domain, newEmails[index], err, data);
      var finalObj = {
        domain: domain,
        email: newEmails[index],
        status: data,
        error: err
      };
      socket.emit('success', {
        data: finalObj
      });
    });
  });
}
