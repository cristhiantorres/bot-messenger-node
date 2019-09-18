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

app.get('/webhook', (req, res) => {
  
  let mode = req.query['hub.mode'];
  let verify_token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && verify_token) {
    
    if (mode === "subscribe" && verify_token === process.env.WEBHOOK_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.send(challenge);
      // res.status(200).send(challenge);
    } else {
      console.log("WEBHOOK_NOT_VERIFIED");
      res.send("WEBHOOK_NOT_VERIFIED");
      // res.sendStatus(403);
    }
  } else {
    console.log("WEBHOOK");
    res.send("WEBHOOK");
    // res.sendStatus(400);
  }
});

app.post('/webhook', (req, res) => {
  let body = req.body;
  
  if (body.object === 'page') {
    
    console.log('Entries', body.entry);
    
    body.entry.forEach(entry => {

      let webhook_event = entry.messaging[0];
      console.log("webhook_event", webhook_event);
      

      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: ", sender_psid);


      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if(webhook_event.postback){
        handlePostBack(sender_psid, webhook_event.postback);
      }
      
      res.status(200).send("EVENT_RECEIVED");
    });
  } else {
    res.sendStatus(400);
  }
});

const handleMessage = (sender_psid, received_message) => {
  let response;

  // check if the message contains text
  if (received_message.text) {
    response = {
      "text": `You sent the message "${received_message.text}". Now send me an image!`
    }
  }

  callSendAPI(sender_psid, response);
}

const handlePostBack = (sender_psid, received_postback) => {

}

const callSendAPI = (sender_psid, response) => {
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }


  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.FB_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log("message sent");
    } else {
      console.error("Unable to send message: " + err);
    }
  });
}