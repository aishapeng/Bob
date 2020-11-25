const express = require('express')
const bodyParser = require('body-parser')
const {WebhookClient} = require('dialogflow-fulfillment');

const app = express()
app.use(bodyParser.json())
const port = process.env.PORT || 3000

const functions = require('firebase-functions')
// The Firebase Admin SDK to access the Firebase Realtime Database.
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://dragonflychatbotproject.firebaseio.com'
  });

// if(process.env.NODE_ENV === 'production'){
//     //set static folder
//     app.use(express.static('client/build'));
// }
// app.get('*',(request, response) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// });

app.post('/dialogflow-fulfillment', (request, response) => {
    dialogflowFulfillment(request, response)
});

app.get('/', (request, response) => {
    response.send("GET Request Called") 
    console.log(`ok`)
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




