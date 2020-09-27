const iface = process.env.IFACE || "localhost"
const port = process.env.PORT || 8081
const message = `
<html>

<head>
<title>FooBar Inc.</title>
</head>

<body>
  <h1>Response from backend:</h1>
  <div id="content"></div>

  <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
  <script>
  $( document ).ready(function(){
    $.ajax({
      url: 'http://localhost:8082',
      type: 'get',
      success: function(data){
        $('#content').html(data);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        var errorMsg = 'Ajax request failed: ' + xhr.responseText;
        $('#content').html(errorMsg);
      }
    });
  });
  </script>
</body>

</html>
`
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send(message)
})

app.listen(port, iface, () => {
  console.log(`Listening at http://${iface}:${port}`)
})

process.on('SIGINT', shutdown);

function shutdown() {
  console.log('graceful shutdown express');
  server.close(function () {
    console.log('closed express');
  });
}
