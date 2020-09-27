const express = require('express')
const app = express()
const port = 8081
const message = `
<html>

<head>
<title>FooBar Inc.</title>
</head>

<body>
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

app.get('/', (req, res) => {
  res.send(message)
})

app.listen(port, '127.0.0.1', () => {
  console.log(`Listening at http://localhost:${port}`)
})
