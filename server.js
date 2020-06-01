const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://camilasmoteiro:tegvVidguL81zTW9@cluster0-afhby.mongodb.net/test?retryWrites=true&w=majority";

app.use(bodyParser.urlencoded({ extended: true}))

MongoClient.connect(uri, (err, client) => {
    if(err) return console.log(err)
    db = client.db('test').collections('devices')

    app.listen(3000, () => {
        console.log('server running on port 3000')
    })
})

app.set('view engine', 'ejs')

app.route('/')
.get(function(req, res) {
    const cursor = db.collection('data').find()
    res.render('index.ejs')
})

.post((req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('O registro foi salvo no banco de dados')
        res.redirect('/show')
    })
})

app.route('/show')
.get ((req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if(err) return console.log(err)
        res.render('show.ejs', {data: results})
    })
})


app.route('/edi/:id')
.get((req, res) => {
    let id = req.params.id
    
    db.collection('data').find(ObjectId(id)).toArray((err, result) => {
        if(err) return res.send(err)
        res.render('edit.js', { data: result })
    })
})

.post((req, res) => {
    let id = req.params.id
    let name = req.body.name
    let surname = req.body.surname

    db.collection('data').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            surname: surname
        }
    }, (err, result) => {
        if(err) return res.send(err)
        res.redirect('/show')
        console.log('Registro atualizado no banco de dados')
    })
})

app.route('/delete/:id')
.get((req, res) => {
    let id = req.params.id
    
    db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if(err) return res.send(500, err)
        console.log('Registro excluído do banco de dados!')
        res.redirect('/show')
    })
})


app.post('/show', (req, res) =>{
    console.log(req.body)
})

