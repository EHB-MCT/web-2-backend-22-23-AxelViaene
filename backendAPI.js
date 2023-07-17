const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.port || 3000;
const {v4: uuidv4, validate: uuidValidate} = require('uuid');
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


//TEST ROUTE
app.get('/testMongo', async (req ,res) => {
  try {
    await client.connect();
    const col = client.db(dbName).collection("Users");
    const users = await col.find({}).toArray();
    const UserIds = users.map(user => user.UserId);
    const highestUserId = Math.max(...UserIds);
    console.log(highestUserId+1)

    res.status(200).send(users);
  } finally {
    await client.close();
  }
})


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
});

//get user by UserId
app.get('/user', async(req,res) => {
  try{
    await client.connect();
    const col = client.db(dbName).collection("Users");
    const query = { UserId: Number(req.query.userid)};
   
    const user = await col.findOne(query);

    if(user){
      res.status(200).send(user);
      return;
    } else {
      res.status(400).send('not found with UserId: ' + req.query.userid)
    }
  }
  finally {
    await client.close();
}
});

//register new user
app.post('/saveusers', async (req, res) => {

  //check for empty fields
  if(!req.body.name || !req.body.email || !req.body.password){
    res.status(401).send({
    status: "Bad request",
    message: "Some fields are missing: name, email, password."
  })
  return
  }

  try {
    //connect to db and retrieve the right collection
    await client.connect();
    const col = client.db(dbName).collection('Users'); 
    
    //getting highest UserId from database
    const users = await col.find({}).toArray();
    const UserIds = users.map(user => user.UserId);
    const highestUserId = Math.max(...UserIds)+1;

    const newUser = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          UserId: highestUserId,
          uuid: uuidv4()
    }

    //check for duplicates
    const user = await col.findOne({email: req.body.email});
    if(user) {
      res.status(400).send('Bad request: User already in database with email: ' + req.body.email)
      return
    }

    //insert in database
    let insertResult = await col.insertOne(newUser)
    //send back succesmessage
    res.status(201).send(`User saved with UserId ${highestUserId}`);

  
  } catch(error) {
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

//login existing user
app.post('/loginuser', async (req, res) => {
    //check for empty fields
    if(!req.body.email || !req.body.password){
      res.status(401).send({
      status: "Bad request",
      message: "Some fields are missing: email, password."
    })
    return
    }

  try {
      //connect to db and retrieve the right collection
      await client.connect();

      const loginuser = {
        email: req.body.email,
        password: req.body.password
      }

      const col = client.db(dbName).collection('Users');

      const query = { email: loginuser.email}
      const user = await col.findOne(query)

      if(user){
        //compare passwords
        if(user.password == loginuser.password){
          res.status(200).send({
            status: "Authentication succesfull",
            message: "Logged in.",
            data: {
              name: user.name,
              email: user.email,
              uuid: user.uuid,
              UserId: user.UserId
            }
          })
        }else {
          res.status(401).send({
            status: "Authentication error",
            message: "Password is incorrect."
          })
        }
      } else {
        //no user found
        res.status(401).send({
              status: "Authentication error",
              message: "No user with this email has been found."
            })
      }
  }
  finally {
    await client.close();
}
})


app.post('/verifyuuid', async (req, res) => {
  //check for empty and faulty uuid
  if(!req.body.uuid){
    res.status(401).send({
    status: "Bad request",
    message: "uuid is missing."
  })
  return
  } else {
    if (!uuidValidate(req.body.uuid)) {
      res.status(401).send({
        status: "Authentication error",
        message: "uuid is not a valid uuid."
      })
      return
    }
  }

try {
    //connect to db and retrieve the right collection
    await client.connect();
    const col = client.db(dbName).collection('Users');

    const query = { uuid: req.body.uuid}
    const user = await col.findOne(query)

    if(user){
        res.status(200).send({
          status: "Authentication succesfull",
          message: "Your uuid is valid.",
          data: {
            name: user.name,
            email: user.email,
            uuid: user.uuid
          }
        })
      }else {
        res.status(401).send({
          status: "Verify error",
          message: `No user exists with uuid ${req.body.uuid}`
        })
      }
  }
  finally {
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

//get one weapon by GreatswordId
app.get('/weapon', async (req, res) => {
  try {
    await client.connect();
    const col = client.db(dbName).collection('Greatswords');
    const query = { GreatswordId: Number(req.query.weaponid)};
    const monster = await col.findOne(query);

    if(monster) {
      res.status(200).send(monster);
      return;
    } else {
      res.status(400).send('not found with GreatswordId: ' + req.query.weaponid);
    }
  }
  finally {
    client.close();
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
app.get('/monster', async (req,res) => {
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
app.post('/savemonster', async (req, res) => {
  try {
    await client.connect();
    const col = client.db(dbName).collection('Monsters');

    //check for duplicates
    const monster = await col.findOne({MonsterId: req.body.MonsterId});
    if(monster) {
      res.status(400).send('Bad request: Monster already in database with MonsterId: ' + req.body.MonsterId)
      return
    }
    let newMonster = {
      name: req.body.name,
      description: req.body.description,
      MonsterId: req.body.MonsterId,
      locations: req.body.locations,
      resistances: req.body.resistances,
      weaknesses: req.body.weaknesses
    }

    //insert in database
    let insertResult = await col.insertOne(newMonster);
    res.status(201).send(`Monster saved with MonsterId ${req.body.MonsterId}`);
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

// ----LINKED-TABLES-----//
//get all hunts
app.get('/hunts', async(req, res) => {
  try {
    await client.connect();
    const col = client.db(dbName).collection("Hunts");
    const hunts = await col.find({}).toArray();
    res.status(200).send(hunts);
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

//save new hunt
app.post('save_hunt', async (req, res) => {
  try {
    await client.connect();
    const col = client.db(dbName).collection('Hunts');

    //getting highest HuntId from database
    const hunts = await col.find({}).toArray();
    const HuntIds = hunts.map(hunt => hunt.HuntId);
    const highestHuntId = Math.max(...HuntIds)+1;

    const newHunt = {
      UserId: req.body.UserId,
      MonsterId: req.body.MonsterId,
      GreatswordId: req.body.GreatswordId,
      location: req.body.location,
      HuntId: highestHuntId
    }

     //insert in database
     let insertResult = await col.insertOne(newHunt)
     //send back succesmessage
     res.status(201).send(`Hunt saved with HuntId ${highestHuntId}`);
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

//get all user_greatswords
app.get('/user_greatswords', async (req,res) => {
  try {
    await client.connect();
    const col = client.db(dbName).collection("Users_Greatswords");
    const users_greatswords = await col.find({}).toArray();
    res.status(200).send(users_greatswords);
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

//post user_greatsword
app.post('/save_user_greatsword', async (req, res) => {
  try {
    await client.connect();
    const col = client.db(dbName).collection('Users_Greatswords');

    const newLink = await col.findOne({UserGreatswordId: req.body.UserGreatswordId});
    if(newLink) {
      res.status(400).send('Bad request: User_Greatsword already in database with UserGreatswordId: '
       + req.body.UserGreatswordId);
      return
    }
  
    let newUser_Greatsword = {
      GreatswordId: req.body.GreatswordId,
      UserGreatswordId: req.body.UserGreatswordId,
      UserId: req.body.UserId
    }

    let insertResult = await col.insertOne(newUser_Greatsword)

    res.status(201).send(`user_greatsword saved with UserGreatswordId ${req.body.UserGreatswordId}`)
  
} catch(error) {
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

//delete one user_greatsword
app.delete('/delete_user_greatsword', async (req, res) => {
  try {
    await client.connect();
    const col = client.db(dbName).collection("Users_Greatswords");
    const query = { UserGreatswordId: Number(req.query.usergreatswordid)};
    const user_greatsword = await col.deleteOne(query);

    if(user_greatsword){
    res.status(200).send('user_greatsword ' + req.query.usergreatswordid + ' deleted')
    }
  }
  finally {
    await client.close();
}
});

app.get('/', (req, res) => {
  console.log("Local")
  res.redirect('/info.html')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });