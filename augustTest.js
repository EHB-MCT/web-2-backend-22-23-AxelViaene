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
const dbName = 'API_Structuur'

//mongo test
async function getUsers() {
  try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection("Users");
      return await col.find().toArray();
  } finally {
      await client.close();
  }
}

async function registerUser() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("Users");
        const saveUser = {UserId:user.UserId, name: user.name, email: user.email, password: user.password}
        return col.insertOne(saveUser)
    } finally {
        await client.close();
    }
}

async function getWeapons() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("Greatswords");
        return await col.find().toArray();
    } finally {
        await client.close();
    }
}

async function getHunts() {
  try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection("Hunts");
      return await col.find().toArray();
  } finally {
      await client.close();
  }
}

async function getMonsters() {
  try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection("Monsters");
      return await col.find().toArray();
  } finally {
      await client.close();
  }
}

async function getUserGreatswords() {
  try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection("Users_Greatswords");
      return await col.find().toArray();
  } finally {
      await client.close();
  }
}

async function getUserHunts() {
  try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection("User_Hunts");
      return await col.find().toArray();
  } finally {
      await client.close();
  }
}


//Get all users
app.get('/users', async (_, response) => {
    await getUsers().then(users => response.send(users))
});

//register user
app.post('/users', async (request, response) => {
  registerUser(request.body).then(user => response.send(user))
});

//get all weapons
app.get('/weapons', async (_, response) => {
    await getWeapons().then(weapons => response.send(weapons))
});

//get all hunts
app.get('/hunts', async (_, response) => {
  await getHunts().then(hunts => response.send(hunts))
});

//get all monsters
app.get('/monsters', async (_, response) => {
  await getMonsters().then(monsters => response.send(monsters))
});

//get all user_greatswords
app.get('/user_greatswords', async (_, response) => {
  await getUserGreatswords().then(user_greatswords => response.send(user_greatswords))
});

//get all user_hunts
app.get('/user_hunts', async (_, response) => {
  await getUserHunts().then(user_hunts => response.send(user_hunts))
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })