var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

require('dotenv').config();

var app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`El servidor se encuentra en el puerto ${port}`);
});

app.get('/', function (req, res) {
  res.send('Hola a todos!');
});

app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === process.env.WEBHOOK_TOKEN) {
    res.send(req.query['hub.challenge'])
  } else {
    res.send("No estas autorizado.");
  }
});