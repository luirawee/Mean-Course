const express = require("express");

const PostsController = require("../controllers/posts");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const extracFile = require("../middleware/file");

router.post("", checkAuth, extracFile, PostsController.createPosts);

router.put("/:id", checkAuth, extracFile, PostsController.updatePosts);

router.delete("/:id", checkAuth, PostsController.deletePosts);

router.get("", PostsController.getAllPosts);

router.get("/:id", PostsController.getByIdPosts);

module.exports = router;
