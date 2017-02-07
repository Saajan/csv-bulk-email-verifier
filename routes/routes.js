module.exports = function (express, app, fs, verify, csv, $) {
  var router = express.Router();

  router.get('/', function (req, res, next) {
    var domains = [];
    var emails = [];
    var result;
    fs.createReadStream('public/dist/static/email.csv')
      .pipe(csv())
      .on('data', function (data) {
        emails.push(data.Emails);
        domains.push((data.Emails).split('@')[1]);
      }).on('end', function () {
        verify.verifyDomainsMX(domains).then(function (res) {
          //console.log('Domains Status: ', res);
          result = res;
          console.log(result);
        });

        //console.log(res);
        //verify.verifyEmails(domains, emails, {}, function(err, data){
        //console.log("Email Stats: ", err, data);	
        //});
      });
    res.render('index', {
      helpers: {
        //unverified: result.unverified,
        //verified: result.verified,
        domains: domains,
        emails: emails
      }
    });
  });

  app.use('/', router);
};
