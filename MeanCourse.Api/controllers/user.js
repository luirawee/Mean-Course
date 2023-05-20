const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.createUser = async (req, res, next) => {
  let user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  await User.findOne({ email: user.email }).then(
    (result) => {
      if (!result) {
        return res.status(400).json({ message: "E-mail duplicated" });
      }
    },
    (error) => {
      return res.status(500).json({ message: error.message });
    }
  );

  await bcrypt.hash(user.password, 10).then((hash) => {
    user.password = hash;
  });
  user.save().then(
    (result) => {
      return res.status(201).json(result);
    },
    (error) => {
      return res.status(500).json({ message: error.message });
    }
  );
};

exports.userLogin = (req, res, next) => {
  let fetcedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user)
        return res
          .status(401)
          .json({ message: "Invalid authentication credentials!" });
      fetcedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result)
        return res
          .status(401)
          .json({ message: "Invalid authentication credentials!" });
      const token = jwt.sign(
        { email: fetcedUser.email, userId: fetcedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ token: token, expiresIn: 3600 });
    })
    .catch((error) => {
      return res.status(500).json({ message: error.message });
    });
};
