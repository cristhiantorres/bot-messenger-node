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
  res.send(`Hola a todos!`);
});

app.get('/webhook', function (req, res) {

  let mode = req.query['hub.verify_token'];
  let verify_token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && verify_token) {
    if ( mode === 'subscribe' && verify_token === process.env.WEBHOOK_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      console.log("WEBHOOK_NOT_VERIFIED");
      res.sendStatus(403);
    }
  }
});