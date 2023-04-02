const Post = require("../models/post");

exports.createPost = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });
    // console.log(post)
    post
      .save()
      .then((createdPost) => {
        // console.log("Document added successfully")
        res.status(201).json({
          message: "Post added successfully",
          post: {
            id: createdPost._id,
            title: createdPost.title,
            content: createdPost.content,
            imagePath: createdPost.imagePath,
          },
        });
      })
      .catch(() => {
        console.log("Something went wrong");
      });
  }

  exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId,
    });
    Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      post
    ).then((result) => {
      // console.log(result)
      if (result.modifiedCount > 0) {
        res.status(200).json({
          message: "Updated successfully",
        });
      } else {
        res.status(401).json({
          message: "Not authorized",
        });
      }
    });
  }

  exports.getAllPosts = (req, res, next) => {
    // res.send("This is a message from the second middleware");
    Post.find().then((doc) => {
      // console.log(doc)
      res.status(200).json({
        status: "Success",
        posts: doc,
      });
    });
  }

  exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "Post Not Found",
        });
      }
    });
  }

  exports.deletePost = (req, res, next) => {
    console.log(req.params.id);
    // Post.findByIdAndDelete(req.params.id).then(() => {
    //     res.status(200).json({
    //         message: `Post ${req.params.id} is deleted`
    //     }).catch(() => {
    //         console.log("Unable to delete a post")
    //     })
    // })
  
    Post.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId,
    })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.status(200).json({
            message: "Updated successfully",
          });
        } else {
          res.status(401).json({
            message: "Not authorized",
          });
        }
      })
      .catch(() => {
        console.log("something went wrong");
      });
  }

