module.exports = function (express, app, fs, verify, csv, $, _) {
  var router = express.Router();

  router.get('/', function (req, res, next) {
    var domains = [];
    var emails = [];
    var result = [];
    var completeArray = [];
    fs.createReadStream('public/dist/static/email.csv')
      .pipe(csv())
      .on('data', function (data) {
        var email = [];
        emails.push(data.Emails);
        domains.push((data.Emails).split('@')[1]);
        email.push(data.Emails);
        //console.log((data.Emails).split('@')[1], data.Emails);
        //verify.verifyEmails((data.Emails).split('@')[1], email, {}, function (err, data) {
        //  result.push(data);
        //});
      }).on('end', function (data) {

        var uniqueDomain = _.uniq(domains);
        _.map(uniqueDomain, function (value) {
          var emailsArray = [];
          _.map(emails, function (value1) {
            if (value1.endsWith(value)) {
              emailsArray.push(value1);
            }
          });
          verify.verifyEmails(value, emailsArray, {}, function (err, data) {
            var finalObj = {
              domain:value,
              email:emailsArray,
              status:data
            };
            completeArray.push(finalObj);
            console.log(finalObj);
          });
          
        });

        console.log(completeArray);
        //_.map(emails, function (value1) {
        //     verify.verifyEmails((data.Emails).split('@')[1], email, {}, function (err, data) {
        //       result.push(data);
        //    });
      });

    res.render('index', {
      helpers: {
        result: completeArray,
        domains: domains,
        emails: emails
      }
    });
  });

  app.use('/', router);
};
