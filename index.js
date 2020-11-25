const express = require('express')
const bodyParser = require('body-parser')
const { request } = require('http')
const { response } = require('express')
const app = express()
const functions = require('firebase-functions')
const {WebhookClient} = require('dialogflow-fulfillment');

// The Firebase Admin SDK to access the Firebase Realtime Database.
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://dragonflychatbotproject.firebaseio.com'
  });


app.use(bodyParser.json)
const port = process.env.PORT || 3000

app.post('/dialogflow-fulfillment', (request, response) => {
    dialogflowFulfillment(request, response)
})

app.get('/', () => {
    console.log("ok")
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

const dialogflowFulfillment = (request, response) => {
    const agent = new WebhookClient({request, response})

    function sayHello(agent){
        agent.add("Heroku")
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', sayHello)

    agent.handleRequest(intentMap)
}




