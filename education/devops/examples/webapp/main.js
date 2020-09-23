var http = require('http')

process.on('SIGINT', function() {
  console.log('Server has stopped');
  process.exit();
});

http.createServer(onRequest).listen(8888);
console.log('Server has started');

function onRequest(request, response){
  response.writeHead(200);
  response.write('Hello World');
  response.end();
}
