module.exports = function (express, app, fs, verify, csv, $, _, io, writer) {
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
            //console.log(data);
            emails.push(data.Emails);
            domains.push((data.Emails).split('@')[1]);
          }).on('end', function () {
            writer.pipe(fs.createWriteStream('public/dist/static/verified.csv'));

            var uniqueDomain = _.uniq(domains);
            _.map(uniqueDomain, function (value) {
              var emailsArray = [];
              _.map(emails, function (value1) {
                if (value1.endsWith(value)) {
                  emailsArray.push(value1);
                }
              });
              io.on('connection', function (socket) {
                verify.verifyEmails(value, emailsArray, {}, function (err, data) {
                  console.log(data,err);
                  if (data !== undefined) {
                    if (data.status.success !== false) {
                      if (data.verified !== undefined) {
                        if (data.verified.length != 0) {
                          writer.write({
                            email: data.verified
                          });
                        }
                      }
                    }
                  }
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
