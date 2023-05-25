const express = require('express')
const bodyParser = require('body-parser')
const {MongoClient} = require('mongodb')

const app = express()
const port = 3000


app.use(express.static('public'));
app.use(bodyParser.json())

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