(function () {

  var socket = io.connect('https://digitvalue.herokuapp.com/');
  socket.on('success', function (data) {
    var fullData = data.data;
    if (fullData.status != null || fullData.status != undefined) {
      var tbody = $('.domain-table tbody');
      var tr = $('<tr></tr>');
      var td1 = $('<td></td>').text(fullData.domain);
      tr.append(td1);
      var td2 = $('<td></td>').text(fullData.email.toString());
      tr.append(td2);
      var td3 = $('<td></td>').text(fullData.status.success);
      tr.append(td3);
      var td4 = $('<td></td>').text(fullData.status.verified.toString());
      tr.append(td4);
      var td5 = $('<td></td>').text(fullData.status.unverified.toString());
      tr.append(td5);
      $(tbody).append(tr);
    }
  });

})();
