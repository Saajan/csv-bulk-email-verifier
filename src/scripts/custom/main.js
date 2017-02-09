var csvWriter = require('csv-write-stream');
var writer = csvWriter();

var writer = csvWriter();
writer.pipe(fs.createWriteStream('public/dist/static/out.csv'));

var socket = io.connect('https://digitvalue.herokuapp.com/');
// var socket = io.connect('http://localhost:3000');

socket.on('success', function(data) {
  var fullData = data.data;
  if (fullData.status != null || fullData.status != undefined) {
    writer.write({
      email: fullData.status.verified.toString()
    });
  }
});
