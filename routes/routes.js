module.exports = function(express, app, fs, verify, csv, $, _, io) {
  var router = express.Router();
  require('events').EventEmitter.defaultMaxListeners = Infinity;

  router.get('/', function(req, res, next) {
    var domains = [];
    var emails = [];
    fs.createReadStream('public/dist/static/email.csv')
      .pipe(csv())
      .on('data', function(data) {
        emails.push(data.Emails);
        domains.push((data.Emails).split('@')[1]);
      }).on('end', function() {
        var uniqueDomain = _.uniq(domains);
        _.map(uniqueDomain, function(value) {
          var emailsArray = [];
          _.map(emails, function(value1) {
            if (value1.endsWith(value)) {
              emailsArray.push(value1);
            }
          });
          io.on('connection', function(socket) {
            verify.verifyEmails(value, emailsArray, {}, function(err, data) {
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

    res.render('index', {
      helpers: {}
    });
  });

  app.use('/', router);
};
