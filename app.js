// simple express server
var express = require('express');
var fs = require('fs');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();
var config = require('./config/config.js');
var _ = require('underscore');
var fileUpload = require('express-fileupload');
var path = require('path');
var csvWriter = require('csv-write-stream');
var writer = csvWriter();

app.set('views', path.join(__dirname, 'views'));

app.engine('handlebars', exphbs({
  defaultLayout: 'layout',
  layoutsDir: 'views/layouts/',
  partialsDir: 'views/partials/'
}));

app.use(fileUpload());

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.set('host', config.host);

app.use(express.static(path.join(__dirname, 'public')));

var server = require('http').createServer(app);

var io = require('socket.io').listen(server);

require('./routes/routes.js')(express, app, fs, _, io, writer);

server.listen(process.env.PORT || 3000, function () {
  if (process.env.PORT !== undefined) {
    console.log('Server is running at port ' + process.env.PORT);
  } else {
    console.log('Server is running at port');
  }
});
