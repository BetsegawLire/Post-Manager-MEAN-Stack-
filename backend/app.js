const express = require('express');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
    next()
})

app.post('/api/posts', (req, res, next) => {
    const post = req.body;
    console.log(post)
    res.status(201).json({
        message: "Post added successfully"
    })
})

app.use(('/api/posts'),(req, res, next) => {
    // res.send("This is a message from the second middleware");
    const posts = [
        {
            id: "id-1",
            title: "post-1",
            content: "content-1"
        },
        {
            id: "id-2",
            title: "post-2",
            content: "content-2"
        },
        {
            id: "id-3",
            title: "post-3",
            content: "content-3"
        }
    ]

    res.status(200).json({
        status: "Success",
        posts
    })
})

module.exports = app;