module.exports = function (express, app, fs, verify, csv, $, _, io) {
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
            domains.push((data.Emails).split('@')[1]);
          }).on('end', function () {
            var uniqueDomain = _.uniq(domains);
            _.map(uniqueDomain, function (value) {
              var emailsArray = [];
              _.map(emails, function (value1) {
                if (value1.endsWith(value)) {
                  emailsArray.push(value1);
                }
              });
              io.on('connection', function (socket) {
                for (var i = 0; i <= emailsArray.length; i++) {
                  (function (ind) {
                    setTimeout(function () {
                      console.log(ind);
                      if (ind === limit) {
                        console.log('It was the last one');
                      }
                      verify.verifyEmails(value, emailsArray, {}, function (err, data) {
                        var finalObj = {
                          domain: value,
                          email: emailsArray,
                          status: data,
                          error: err
                        };
                        socket.emit('success', {
                          data: finalObj
                        });
                      });
                    }, 1000 + (3000 * ind));
                  })(i);
                }
              });
            });
          });
      }
    });
    res.render('upload', {
      helpers: {}
    });
  });

  router.get('/', function (req, res, next) {
    res.render('index', {
      helpers: {}
    });
  });

  app.use('/', router);
};
