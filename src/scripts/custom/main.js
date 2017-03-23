(function () {
  var socket = io.connect('https://digitvalue.herokuapp.com/');
  // var socket = io.connect('http://localhost:3000');
  //var fullData = [];
  var jsonData = [];

  socket.on('emails', function (data) {

    var fullEmails = data.data;

    fullEmails.forEach(function (email, index) {

      var tbody = $('.domain-table tbody');
      var tr = $('<tr></tr>');
      var td11 = $('<td></td>').text(index);
      tr.append(td11);
      var td1 = $('<td class="email-name"></td>').text(email);
      tr.append(td1);
      var td2 = $('<td class="status"></td>').text("false");
      tr.append(td2);
      $(tbody).append(tr);

    });

  });
  socket.on('success', function (data) {
    var fullData = data.data;
    console.log(fullData);
    //fullDatum.forEach(function (fullData, index) {
    if (fullData.status != null || fullData.status != undefined) {
      if ((fullData.status.verified).length > 0) {
        var json = {
          email: fullData.email
        };
        jsonData.push(json);
      }
      if ((fullData.status.verified).length > 0) {
        var search = fullData.email;
        $(".domain-table tbody tr .email-name").filter(function () {
          return $(this).text() == search;
        }).parent('tr').css('color', 'green').text("verified");
      } else {
        var search = fullData.email;
        $(".domain-table tbody tr .email-name").filter(function () {
          return $(this).text() == search;
        }).parent('tr').css('color', 'red').find('.status').text("unverified");
      }
    } else if (fullData.error != null) {
      var search = fullData.email;
      $(".domain-table tbody tr .email-name").filter(function () {
        return $(this).text() == search;
      }).parent('tr').css('color', '#aaa').find('.status').text("absent");
    }
    //});
  });

  function convertArrayOfObjectsToCSV(args) {
    var result, keys, lineDelimiter, data;
    data = args.data || null;
    if (data == null || !data.length) {
      return null;
    }
    lineDelimiter = args.lineDelimiter || '\n';
    keys = Object.keys(data[0]);
    result = '';
    result += keys;
    result += lineDelimiter;
    data.forEach(function (item) {
      result += item.email;
      result += lineDelimiter;
    });
    return result;
  }

  $('#csvid').on('click', function () {
    var data, filename, link;
    var csv = convertArrayOfObjectsToCSV({
      data: jsonData
    });
    if (csv == null) return;
    filename = 'export.csv';
    if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);
    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
  });
})();
