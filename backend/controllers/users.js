const User = require("../models/users");
const bcrypt = require("bcryptjs");
exports.getAll = (req, res) => {
  try {
    console.log("Getting all users..");
    User.find().then((result) => {
      res.status(200).json({ status: "success", data: result });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", err });
  }
};

exports.addUser = (req, res) => {
  try {
    let { firstName, lastName, email, password, role, status } = req.body;
    let profileImage = req.files.profileImage
      ? `${process.env.API_URL}/static/${req.files.profileImage[0].filename}`
      : null;
    let userData = {
      firstName,
      lastName,
      email,
      password,
      role,
      profileImage,
      status,
    };
    User.findOne({
      email: req.body.email,
    }).then((user) => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash;

          User.create(userData)
            .then((user) => {
              res.status(200).json({ status: "success" });
            })
            .catch((err) => {
              res.send({ error: err });
            });
        });
      } else {
        res.json({
          status: "failed",
          message: "User already exists,choose another email",
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "err", err });
  }
};

exports.editUser = (req, res) => {
  try {
    let { _id, firstName, lastName, email, role, status } = req.body;
    req.files.profileImage
      ? (profileImage = `${process.env.API_URL}/static/${req.files.profileImage[0].filename}`)
      : (profileImage = req.body.profileImage);
    User.findOne({
      _id: req.body._id,
    }).then((user) => {
      let userData = {
        firstName: firstName ? firstName : user.firstName,
        lastName: lastName ? lastName : user.lastName,
        email: email ? email : user.email,
        role: role ? role : user.role,
        profileImage: profileImage ? profileImage : user.profileImage,
        status: status ? status : user.status,
      };
      if (user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          req.body.password
            ? (userData.password = hash)
            : console.log("password has not changed");
          User.updateOne({ email: user.email }, userData)
            .then((user) => {
              res.status(200).json({ status: "success" });
            })
            .catch((err) => {
              res.send({ error: err });
            });
        });
      } else {
        res
          .status(200)
          .json({ status: "failed", message: "User does not exist" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "err", err });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    User.deleteOne({ _id: req.params.id }).then((result) => {
      result.deletedCount === 1
        ? res.status(200).json({ status: "success" })
        : res
            .status(200)
            .json({ status: "failed", message: "Couldn't delete,contact us" });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", err });
  }
};

exports.changePassword = (req, res) => {
  try {
    User.findOne({
      _id: req.body._id,
    }).then((user) => {
      if (user) {
        canAccess = bcrypt.compareSync(req.body.oldPassword, user.password);
        if (canAccess) {
          console.log(user.password);
          console.log(user._id);
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            console.log(hash);
            User.updateOne(
              { _id: user._id },
              { $set: { password: hash } }
            ).then((res) => console.log(res));
            res
              .status(200)
              .json({ status: "success", message: "Updated successfully" });
          });
        } else {
          res.status(200).json({ error: "Wrong Password" });
        }
      } else {
        res.status(200).json({ error: "User does not exist" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", err });
  }
};
