(function () {
  var socket = io.connect('https://digitvalue.herokuapp.com/');
  // var socket = io.connect('http://localhost:3000');
  var jsonData = [];
  var index = 0;
  socket.on('success', function (data) {
    var fullData = data.data;
    console.log(fullData);
    index++;
    if (fullData.status != null || fullData.status != undefined) {
      if ((fullData.status.verified).length > 0) {
        // if (fullData.status.verified == '') {
        //console.log(fullData);
        // $.each(fullData.status.verified, function (key, value) {
        var json = {
          email: fullData.email
        };
        jsonData.push(json);
        // });
        // }
      }
      var tbody = $('.domain-table tbody');
      var tr = $('<tr></tr>');
      var td11 = $('<td></td>').text(index);
      tr.append(td11);
      var td1 = $('<td></td>').text(fullData.domain);
      tr.append(td1);
      var td2 = $('<td></td>').text(fullData.email);
      tr.append(td2);
      var td3 = $('<td></td>').text(fullData.status.success);
      tr.append(td3);
      var td4 = $('<td></td>').text(fullData.status.verified);
      tr.append(td4);
      var td5 = $('<td></td>').text(fullData.status.unverified);
      tr.append(td5);
      $(tbody).append(tr);
    } else if (fullData.error != null) {
      var tbody = $('.domain-table tbody');
      var tr = $('<tr></tr>');
      var td11 = $('<td></td>').text(index);
      tr.append(td11);
      var td1 = $('<td></td>').text(fullData.domain);
      tr.append(td1);
      var td2 = $('<td></td>').text(fullData.email);
      tr.append(td2);
      var td3 = $('<td></td>').text("domain absent");
      tr.append(td3);
      var td4 = $('<td></td>').text("");
      tr.append(td4);
      var td5 = $('<td></td>').text("");
      tr.append(td5);
      $(tbody).append(tr);
    }
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
