const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.handleLogin = async (req, res, next) => {
  try {
    User.findOne({
      email: req.body.email,
    })
      .then((user) => {
        if (user) {
          canAccess = bcrypt.compareSync(req.body.password, user.password);
          if (canAccess) {
            const payload = {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              profileImage: user.profileImage,
            };
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
              expiresIn: req.body.rememberMe ? "30d" : "1d",
            });
            res.status(200).json({ status: "success", token });
          } else {
            res.status(200).json({ error: "Wrong Password" });
          }
        } else {
          res.status(200).json({ error: "User does not exist" });
        }
      })
      .catch((err) => {
        res.send("error: " + err);
      });
  } catch (err) {
    console.log(err);
    res.status(200).json({ status: "error", err });
  }
};
