const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')

// const Post = require('./models/post');
// const post = require('./models/post');

const app = express();

// mongoose.connect("mongodb+srv://admin:x63B39YBBiQ5RwWC@cluster0.bccbipv.mongodb.net/node-angular?retryWrites=true&w=majority")
mongoose.connect("mongodb+srv://admin:x63B39YBBiQ5RwWC@cluster0.bccbipv.mongodb.net/node-angular")
.then(() => {
    console.log("Connected successfully")
})
.catch(() => {
    console.log("Connection failed")
})

app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT,  POST, PATCH, DELETE, OPTIONS")
    next()
})

app.use('/api/posts', postRoutes)
app.use('/api/user', userRoutes)

module.exports = app;