// simple express server
var express = require('express');
var fs = require("fs");
var exphbs = require('express-handlebars');
var bodyParser = require("body-parser");
var app = express();
var config = require('./config/config.js');
var verify = require('bulk-email-verifier');
var csv = require('csv-parser')
var $ = require("jquery");
var _ = require("underscore");

var path = require('path');

app.set("views", path.join(__dirname, "views"));

app.engine('handlebars', exphbs({
  defaultLayout: 'layout',
  layoutsDir: 'views/layouts/',
  partialsDir: 'views/partials/'
}));

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.set('host', config.host);

require('./routes/routes.js')(express, app, fs, verify, csv, $,_);

app.use(express.static(path.join(__dirname, 'public')));

var server = require('http').createServer(app);

server.listen(process.env.PORT || 3000, function () {
  if (process.env.PORT !== undefined) {
    console.log("Server is running at port " + process.env.PORT);
  } else {
    console.log("Server is running at port");
  }

});
