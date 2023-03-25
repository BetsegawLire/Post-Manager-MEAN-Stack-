const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Post = require('./models/post');
// const post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://admin:x63B39YBBiQ5RwWC@cluster0.bccbipv.mongodb.net/node-angular?retryWrites=true&w=majority")
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
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
    next()
})

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    // console.log(post)
    post.save().then((createdPost) => {
        // console.log("Document added successfully")
        res.status(201).json({
            message: "Post added successfully",
            postId: createdPost._id
        })
    })
    .catch(() => {
        console.log("Something went wrong")
    })
    
})

app.get(('/api/posts'),(req, res, next) => {
    // res.send("This is a message from the second middleware");
    Post.find().then((doc) => {
        // console.log(doc)
        res.status(200).json({
            status: "Success",
            posts: doc
        })
    })

    
})

app.delete('/api/posts/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "success",
            message: "Document with Id " + req.params.id + " deleted successfully"
        })
    }catch(err) {
        res.status(404).json({
            status: "fail",
            message: err.message
        })
    }
})

app.delete('/api/posts/:id', (req, res, next) => {
    console.log(req.params.id)
    // Post.findByIdAndDelete(req.params.id).then(() => {
    //     res.status(200).json({
    //         message: `Post ${req.params.id} is deleted`
    //     }).catch(() => {
    //         console.log("Unable to delete a post")
    //     })
    // })

    Post.deleteOne({
        _id: req.params.id
    }).then((result) => {
        
        console.log(result)
        res.status(200).json({
            message: `Post ${req.params.id} is deleted`
        })
    }).catch(() => {
        console.log("something went wrong")
    })
})

module.exports = app;