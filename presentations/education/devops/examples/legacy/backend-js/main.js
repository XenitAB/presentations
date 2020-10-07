const port = 8082
const message = "Hello World!"

const express = require('express')
var cors = require('cors');
const app = express()

app.use(cors());
app.get('/', (req, res) => {
  res.send(message)
})

app.listen(port, '127.0.0.1', () => {
  console.log(`Listening at http://localhost:${port}`)
})
