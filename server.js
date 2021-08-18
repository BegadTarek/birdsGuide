const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();
const connectionString = 'mongodb+srv://admin:admin@cluster0.pcgv2.mongodb.net/Test?retryWrites=true&w=majority'

MongoClient.connect(connectionString, {
    useUnifiedTopology: true})
 .then(client => {
    console.log('Connected to Database')
    const db = client.db('hub-posts')
    const postsCollection = db.collection('posts')

    app.set('view engine', 'ejs')

    app.use(bodyParser.urlencoded({extended: true }))

    app.listen(3000, function() {
        console.log('listening on 3000')
    })

    app.get('/', (req, res)=>{
        // res.sendFile(__dirname + '/index.html')
        const cursor = db.collection('posts').find()
        cursor.toArray()
            .then(results => {
                res.render('index.ejs', {posts: results})
            })
            .catch(error => console.error(error))
    })

    app.post('/posts', (req, res)=>{
        postsCollection.insertOne(req.body)
            .then(result=>{
                console.log(result, req.body)
                res.redirect('/')
            })
        .catch(error=>console.error(error))
    })

  })
  .catch(error => console.error(error))
  