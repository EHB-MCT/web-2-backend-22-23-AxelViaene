const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.port || 3000;
const config = require('./config.json');

//cors
const cors = require('cors');
app.use(cors());

app.use(express.static('public'));
app.use(bodyParser.json())

//create client
const { MongoClient } = require("mongodb");

const client = new MongoClient(config.finalUrl);
const dbName = 'API_Structuur'


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

async function getOneUser(UserId) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("Users");
    return await col.findOne(UserId);
  } finally {
    await client.close();
  }
}

async function registerUser() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("Users");
        const saveUser = {UserId: user.UserId, name: user.name, email: user.email, password: user.password}
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

async function getOneMonster(MonsterId) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("Monsters");
    return await col.findOne(MonsterId)
  } finally {
    await client.close();
  }
}

async function saveMonster() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("Monsters");
    const saveMonster = {MonsterId: Monsters.MonsterId, name: Monsters.name, description: Monsters.description, 
    locations: [...Monsters.locations], resistances: [...Monsters.resistances], weaknesses: [...Monsters.weaknesses]};
    return col.insertOne(saveMonster)
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

async function deleteWeapon(UserGreatswordId) {
  console.log(UserGreatswordId)
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("Users_Greatswords");
    col.deleteOne(UserGreatswordId);
  } finally {
    client.close();
  } 
}

// -----USERS-----//
//Get all users
app.get('/users', async (_, response) => {
    await getUsers().then(users => response.send(users))
});

//Get one user 
app.get('/users/:userid', async (request, response) => {
  await getOneUser(request.params.UserId).then(user => response.send(user))
});

//register user
app.post('/users/register', async (request, response) => {
  registerUser(request.body).then(user => response.send(user))
});

// ----WEAPONS-----//
//get all weapons
app.get('/weapons', async (_, response) => {
    await getWeapons().then(weapons => response.send(weapons))
});

// ----MONSTERS-----//
//get all monsters
app.get('/monsters', async (_, response) => {
  await getMonsters().then(monsters => response.send(monsters))
});

//get one monster
app.get('/monsters/:monsterid', async (request, response) => {
  await getOneMonster(request.params.MonsterId).then(monster => response.send(monster))
});

//save one monster
app.post('/monsters/post', (request, response) => {
saveMonster(request.body).then(monster => response.send(monster))
})

// ----LINKED-TABLES-----//
//get all hunts
app.get('/hunts', async (_, response) => {
  await getHunts().then(hunts => response.send(hunts))
});

//get all user_greatswords
app.get('/user_greatswords', async (_, response) => {
  await getUserGreatswords().then(user_greatswords => response.send(user_greatswords))
});

//delete one user_greatsword
app.delete('/user_greatswords/delete', async (request, response) => {
  await deleteWeapon(request.params.UserGreatswordId).then(response.sendStatus(200));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })