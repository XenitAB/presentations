//const iface = "localhost"
const iface = process.env.IFACE || "localhost"
const port = process.env.PORT || 8082
const message = process.env.MESSAGE || "Hello World!"

const express = require('express')
var cors = require('cors');
const app = express()

app.use(cors());
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
