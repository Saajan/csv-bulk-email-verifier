'using strict';

const dns = require('dns');
var csv = require('csv-parser');
var emailExistence = require('email-existence');
var verify = require('../module/bulk-email-verifier');
var io;
module.exports = function(express, app, fs, _, server) {
  io = require('socket.io').listen(server);
  var router = express.Router();
  require('events').EventEmitter.defaultMaxListeners = Infinity;
  router.post('/upload', function(req, res, next) {
    var sampleFile;
    if (!req.files) {
      res.send('No files were uploaded.');
      return;
    }
    sampleFile = req.files.sampleFile;
    sampleFile.mv('public/dist/static/email.csv', function(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        var domains = [];
        var emails = [];
        fs.createReadStream('public/dist/static/email.csv')
          .pipe(csv())
          .on('data', function(data) {
            emails.push(data.Emails);
            // console.log(data);
            domains.push((data.Emails).split('@')[1]);
          }).on('end', function() {
            io.on('connection', function(socket) {
              //_isValidDomainMX(emails, domains);
              _isValidDomainMX(emails, domains, socket);
            });
          });
      }
      res.render('upload', {
        helpers: {}
      });
    });
  });

  router.get('/', function(req, res, next) {
    res.render('index', {
      helpers: {}
    });
  });

  app.use('/', router);
};

const _isValidDomainMX = (emails, domains, socket) => {
  console.log('starting', domains.length);
  var time = 10000;
  setTimeout(function() {
    var mainCount = 0;
    while (domains.length) {
      // console.log(a.splice(0, 10));
      var newDomains = domains.splice(0, 10);
      var newEmails = emails.splice(0, 10);
      newDomains.forEach(function(domaino, index) {
        mainCount++;
        var emailo = newEmails[index];
        verify.verifyEmails(domaino, emailo, {}, function(err, data) {
          console.log('outside_' + mainCount, domaino, emailo, err, data);
          var finalObj = {
            domain: domaino,
            email: emailo,
            status: data,
            error: err
          };
          socket.emit('success', {
            data: finalObj
          });
        });
      });
    }
  }, time);
  time += 10000;
};

