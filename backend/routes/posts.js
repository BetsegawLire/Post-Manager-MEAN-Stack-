const express = require("express");



const postController = require('../controllers/posts')



const checkAuth = require("../middleware/check-auth");
const extractFile = require('../middleware/file')

const router = express.Router();



router.post(
  "",
  checkAuth,
  extractFile,
  postController.createPost
);

router.put(
  "/:id",
  checkAuth,
 extractFile,
  postController.updatePost
);

router.get("", postController.getAllPosts);

router.get("/:id", postController.getPost);

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

router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
