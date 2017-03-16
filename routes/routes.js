'using strict';

const dns = require('dns');
var csv = require('csv-parser');
var emailExistence = require('email-existence');
var verify = require('../module/bulk-email-verifier');

module.exports = function (express, app, fs, _,io) {
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
  io.on('connection', function (socket) {
    setTimeout(function () {
      while (domains.length) {
        // console.log(a.splice(0, 10));
        callForCheckup(domains.splice(0, 10), emails.splice(0, 10));
      }
    }, time);
    time += 10000;
  });
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
