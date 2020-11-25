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

    function readWeather(agent){
        return admin.database().ref('WeatherDescribe').once('value', snapshot => {
           const value = snapshot.val();
              if(value !== null){
               agent.add(`I would describe it as ${value}.`);
              }
            else{
             agent.add("Oops! It seems that no value has been returned from the database");
            }
         });
      }
      
      function readBrightness(agent){
      return admin.database().ref('Brightness').once('value', snapshot => {
         const value = snapshot.val();
            if(value !== null){
              if (value>=90){
                 agent.add(`The brightness is ${value}%, sure is a sunny day!`);
              }else if (value>=60){
                agent.add(`The brightness is ${value}%, good day for gardening!`);
              }else{
                agent.add(`The brightness is ${value}%, sure is gloomy.`);
              }
            }
          else{
           agent.add("Uh oh, I seem to be disconnected!");
          }
        });
      }
      
      function readHumidity(agent){
      return admin.database().ref('Humidity').once('value', snapshot => {
         const value = snapshot.val();
            if(value !== null){
            if (value>=94){
                 agent.add(`The humidity is ${value}%, good for the okra!`);
              }else if (value>=88){
                agent.add(`The humidity is ${value}%, pretty decent airflow.`);
              }else{
                agent.add(`The humidity is ${value}%, dry air huh.`);
              }
            }
          else{
           agent.add("Oops! It seems that no value has been returned from the database");
          }
        });
      }
      
      function readSoilMoisture(agent){
      return admin.database().ref('SoilMoisture').once('value', snapshot => {
         const value = snapshot.val();
            if(value !== null){
              if(value>=70){
                agent.add(`The soil moisture is ${value}%, too much water!`);
              }else if (value>=70){
                agent.add(`The soil moisture is ${value}%, perfectly watered!`);
              }else if (value>=30){
                agent.add(`The soil moisture is ${value}%, I will water the plants soon.`);
              }else{
                agent.add(`The soil moisture is ${value}%, I will water the plants immediately!`);
              }
            }
          else{
           agent.add("Oops! It seems that no value has been returned from the database");
          }
        });
      }
      
      function readTemperature(agent){
      return admin.database().ref('Temperature').once('value', snapshot => {
         const value = snapshot.val();
            if(value !== null){
              if (value>=35){
                agent.add(`The temperature is ${value}%, I have to shelter teh okras!`);
              }else if (value>=30){
                agent.add(`The temperature is ${value}%, perfect temperature for okras.`);
              }else{
                agent.add(`The temperature is ${value}%, not a good day for okras.`);
              }
            }
          else{
           agent.add("Oops! It seems that no value has been returned from the database");
          }
        });
      }
      
      function readWeatherHumidity(agent){
      return admin.database().ref('WeatherHumidity').once('value', snapshot => {
         const value = snapshot.val();
            if(value !== null){
             agent.add(`The weather humidity is ${value}`);
            }
          else{
           agent.add("Oops! It seems that no value has been returned from the database");
          }
        });
      }
      
      function readWeatherTemperature(agent){
      return admin.database().ref('WeatherTemperature').once('value', snapshot => {
         const value = snapshot.val();
            if(value !== null){
             agent.add(`The weather temperature is ${value}`);
            }
          else{
           agent.add("Oops! It seems that no value has been returned from the database");
          }
        });
      }
      
      function readWeatherWindSpeed(agent){
      return admin.database().ref('WeatherWindSpeed').once('value', snapshot => {
         const value = snapshot.val();
            if(value !== null){
             agent.add(`The wind speed is ${value}`);
            }
          else{
           agent.add("Oops! It seems that no value has been returned from the database");
          }
        });
      }

    let intentMap = new Map();
    intentMap.set('Weather Intent', readWeather);
    intentMap.set('Humidity Intent', readHumidity);
    intentMap.set('Brightness Intent', readBrightness);
    intentMap.set('Soil Moisture Intent', readSoilMoisture);
    intentMap.set('Temperature Intent', readTemperature);
    intentMap.set('Weather Humidity Intent', readWeatherHumidity);
    intentMap.set('Weather Temperature', readWeatherTemperature);
    intentMap.set('Weather Wind Speed Intent', readWeatherWindSpeed);

    agent.handleRequest(intentMap)
}




