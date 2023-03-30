const express = require('express')

const Post = require('../models/post')

const router = express.Router()


router.post('', (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    })
    Post.updateOne({_id: req.params.id}, post).then(result => {
        console.log(result)
        res.status(200).json({
            message: "Updated successfully"
        })
    })
})

router.get((''),(req, res, next) => {
    // res.send("This is a message from the second middleware");
    Post.find().then((doc) => {
        // console.log(doc)
        res.status(200).json({
            status: "Success",
            posts: doc
        })
    })

    
})

router.get("/:id", (req, res, next) =>{
    Post.findById(req.params.id).then(post => {
        if(post) {
            res.status(200).json(post)
        }else {
            res.status(404).json({
                message: "Post Not Found"
            })
        }
    })
})

router.delete('/:id', async (req, res) => {
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

router.delete('/:id', (req, res, next) => {
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

module.exports = router