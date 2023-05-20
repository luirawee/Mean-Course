const Post = require("../models/post");

exports.createPosts = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  post.save().then(
    (result) => {
      res.status(201).json(result);
    },
    (error) => {
      res.status(500).json({ message: error.message });
    }
  );
};

exports.updatePosts = (req, res, next) => {
  const _id = req.params.id;
  let imagePath = req.body.imagePath;

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  const post = new Post({
    _id: _id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: _id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.matchedCount > 0) res.status(200).json(post);
      else res.status(401).json({ message: "Not authorized!" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

exports.deletePosts = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      console.log(result);
      if (result.deletedCount > 0) res.status(200).json();
      else res.status(401).json({ message: "Not authorized!" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};
exports.getAllPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize ?? 5;
  const currentPage = +req.query.page ?? 1;
  const indexNum = pageSize * (currentPage - 1);
  const postsQuery = Post.find();
  let fetchedPosts;
  postsQuery.skip(indexNum).limit(pageSize);

  postsQuery
    .then((doc) => {
      fetchedPosts = doc;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({ data: fetchedPosts, total: count });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

exports.getByIdPosts = (req, res, next) => {
  Post.findById(req.params.id)
    .then((doc) => {
      if (doc) res.status(200).json(doc);
      else res.status(404).json({ message: "Not found" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};
