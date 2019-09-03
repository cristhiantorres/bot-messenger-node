var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
app.use(bodyParser.json());

const APP_TOKEN = 'EAAiZCOxdtL20BAPUYb2ZCHi2WzZCjdVqhZA5fTZA7zVNNV9gUXWq7Ybex4CX7ngdNCXLKT4LfxEB0kxocVSO9dhvZBYkDS20R7Uo9BcqvBjtp5BwJa5JSYwcj60MzOAHKc2RrvwAKmeYj1V2LX5ZBSh9OBsKSiYEqORunDNI7WJkPkjnZAZArslPfAAERvPPGUvsZD';

app.listen(80, function () {
  console.log("El servidor se encuentra en el puerto 3000");
});

app.get('/', function (req, res) {
  res.send('Hola a todos!');
});

app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'test_token_say_hello') {
    res.send(req.query['hub.challenge'])
  } else {
    res.send("No estas autorizado.");
  }
});