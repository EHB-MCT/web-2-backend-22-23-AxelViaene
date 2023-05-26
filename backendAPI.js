const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.port || 3000;
const config = require('./config.json');

//cors
const cors = require('cors');
app.use(cors());

app.use(express.static('public'));
app.use(bodyParser.json());

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

// async function getOneUser(UserId) {
//   try {
//     await client.connect();
//     const db = client.db(dbName);
//     const col = db.collection("Users");
//     return await col.findOne(UserId);
//   } finally {
//     await client.close();
//   }
// }

async function registerUser(user) {
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

// async function saveUser() {
//   try {
//     await client.connect();
//     const db = client.db(dbName);
//     const col = db.collection("Users");
//     console.log(req.body);
//     res.send(`data received with ${req.body.name}`);
//   } finally {
//     await client.close();
//   }
// }

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
//get all users
app.get('/users', async(req, res) => {
  try {
    await client.connect();
    const col = client.db(dbName).collection("Users");
    const users = await col.find({}).toArray();
    res.status(200).send(users);
  } 
  catch(error) {
  console.log(error)
  res.status(500).send({
    error: 'Something went wrong',
    value: error
  });
  } 
  finally {
    await client.close();
  }
})

//get user by UserId
app.get('/user', async(req,res) => {
  try{
    await client.connect();
    const col = client.db(dbName).collection("Users");
    const query = { UserId: Number(req.query.userid)};
    console.log(query)
    console.log(req.query)
    console.log(req.query.UserId)
   
    const user = await col.findOne(query);

    if(user){
      res.status(200).send(user);
      return;
    } else {
      res.status(400).send('not found with id: ' + req.query.userid)
    }
  }
  finally {
    await client.close();
}
})

//register new user
app.post('/saveUsers', async (req, res) => {
  try {
    //connect to db and retrieve the right collection
    await client.connect();
    const col = client.db(dbName).collection('Users');

    //check for duplicates
    const user = await col.findOne({UserId: req.body.UserId});
    if(user) {
      res.status(400).send('Bad request: User already in database with UserId: ' + req.body.UserId)
      return
    }

    //create new user object
    let newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      UserId: req.body.UserId
    }

    //insert in database
    let insertResult = await col.insertOne(newUser)

    //send back succesmessage
    res.status(201).send(`User saved with UserId ${req.body.UserId}`);
  
  } finally {
    await client.close();
}
})

// ----WEAPONS-----//
//get all weapons
app.get('/weapons', async (req, res) => {
  try {
    await client.connect();
    const col = client.db(dbName).collection('Greatswords');
    const weapons = await col.find({}).toArray();
    res.status(200).send(weapons)
  }
  catch(error) {
    console.log(error)
    res.status(500).send({
      error: 'Something went wrong',
      value: error
    });
  }
  finally {
    await client.close();
}
});

// ----MONSTERS-----//
//get all monsters
app.get('/monsters', async (req,res) => {
  try{
    await client.connect();
    const col = client.db(dbName).collection("Monsters");
    const monsters = await col.find({}).toArray();
    res.status(200).send(monsters);
  }
  catch(error) {
    console.log(error)
    res.status(500).send({
    error: 'Something went wrong',
    value: error
    });
    }
  finally {
    await client.close();
  }
});

//get one monster
app.get('/monsters/:monsterid', async (req,res) => {
 try {
  await client.connect();
  const col = client.db(dbName).collection("Monsters");
  const query = {MonsterId: Number(req.query.monsterid)};

  const monster = await col.findOne(query);

  if(monster){
    res.status(200).send(monster);
    return;
  } else {
    res.status(400).send('not found with id: ' + req.query.monsterid)
  }
 }
 finally {
  await client.close();
}
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

app.get('/', (req, res) => {
  console.log("Local")
  res.redirect('/info.html')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })