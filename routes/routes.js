'using strict';

const dns = require('dns');
var csv = require('csv-parser');
var emailExistence = require('email-existence');
var verify = require('../module/bulk-email-verifier');
var io;
var startingDomainLength;
module.exports = function (express, app, fs, _, server) {
  io = require('socket.io').listen(server);
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
            console.log('end');
            console.log('starting', domains.length);
            startingDomainLength = domains.length;
            // _isValidDomainMX(emails, domains);
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

const _isValidDomainMX = (emailset, domainset) => {
  // var time = 10000;
  var finalObj = [];
  io.on('connection', function (socket) {
    socket.emit('emails', {
      data: emailset
    });
    setInterval(function () {
      while (domainset.length) {
        // console.log(a.splice(0, 10));
        var newDomains = domainset.splice(0, 10);
        var newEmails = emailset.splice(0, 10);
        newDomains.forEach(function (domaino, index) {
          var emailo = newEmails[index];
          verify.verifyEmails(domaino, emailo, {}, function (err, data) {
            mainCount++;
            console.log('outside_', domaino, emailo);
            finalObj.push({
              domain: domaino,
              email: emailo,
              status: data,
              error: err
            });
            socket.emit('success', {
              data: finalObj
            });
          });
        });
      }
    }, 5000);
  });
  // time += 10000;
};
