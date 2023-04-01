const express = require('express')

const multer = require('multer')

const Post = require('../models/post')

const checkAuth = require('../middleware/check-auth')

const router = express.Router()

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "backend/images")
    },
    filename: (req, file, cb) => {
        const name= file.originalname.toLowerCase().split(' ').join('-')
        const ext = MIME_TYPE_MAP[file.mimetype]
        cb(null, name + '-' + Date.now() + '.' + ext)
    }
})


router.post('', checkAuth, multer({storage: storage}).single('image'),(req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    // console.log(post)
    post.save().then((createdPost) => {
        // console.log("Document added successfully")
        res.status(201).json({
            message: "Post added successfully",
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            }
        })
    })
    .catch(() => {
        console.log("Something went wrong")
    })
    
})

router.put('/:id', checkAuth, multer({storage: storage}).single('image'),(req, res, next) => {
    let imagePath = req.body.imagePath
    if(req.file) {
        const url = req.protocol + "://" + req.get("host")
        imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.body.id, 
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    })
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
        // console.log(result)
        if(result.modifiedCount >0) {

            res.status(200).json({
                message: "Updated successfully"
            })
        } else {
            res.status(401).json({
                message: "Not authorized"
            })
        }
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

// router.delete('/:id', checkAuth, async (req, res) => {
//     try {
//         await Post.findByIdAndDelete(req.params.id);

//         res.status(200).json({
//             status: "success",
//             message: "Document with Id " + req.params.id + " deleted successfully"
//         })
//     }catch(err) {
//         res.status(404).json({
//             status: "fail",
//             message: err.message
//         })
//     }
// })

router.delete('/:id', checkAuth,(req, res, next) => {
    console.log(req.params.id)
    // Post.findByIdAndDelete(req.params.id).then(() => {
    //     res.status(200).json({
    //         message: `Post ${req.params.id} is deleted`
    //     }).catch(() => {
    //         console.log("Unable to delete a post")
    //     })
    // })

    Post.deleteOne({
        _id: req.params.id, creator: req.userData.userId
    }).then((result) => {
        
        if(result.deletedCount >0) {

            res.status(200).json({
                message: "Updated successfully"
            })
        } else {
            res.status(401).json({
                message: "Not authorized"
            })
        }
    }).catch(() => {
        console.log("something went wrong")
    })
})

module.exports = router