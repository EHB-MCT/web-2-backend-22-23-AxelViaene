const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const config = require('./config.json');

//cors
const cors = require('cors');
app.use(cors())

app.use(express.static('public'));
app.use(bodyParser.json())

//create client
const { MongoClient } = require("mongodb");

const client = new MongoClient(config.finalUrl);

//database to use
const dbName = "augustTest";

//mongo test
async function getUsers() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    const db = client.db(dbName);
    const col = db.collection("testCollection");
    

    let newUser = {
        userName: "Grant Lift",
        likedGames:["FFXIV","Monster Hunter World","Age of Empires II"] 
    }

    // Insert a single document, wait for promise so we can read it back
    //const p = await col.insertOne(newUser);
    // Find one document
    const myDoc = await col.findOne();
    // Print to the console
    console.log(myDoc);
    return await col.find().toArray();
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


app.get('/users/', async (_, response) => {
    await getUsers().then(users => response.send(users))
});




app.get('/', (req, res) => {
    console.log("Local")
    res.redirect('/info.html')
  })
  
  app.get('/test', (req, res) => {
    res.send('Test succeeded!')
  })
  
  app.get('/data', (req, res) => {
    let exampleData = {
      name: 'Axel',
      age: 25
    }
    res.send(exampleData)
  })
  
  app.post('/saveData', (req, res) => {
    console.log(req.body);
  
    res.send( `Data received with id: ${req.body.id}`);
  })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })