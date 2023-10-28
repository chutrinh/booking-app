const User = require("../model/user-model");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

// sign up
exports.postSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors.array()[0].msg);
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        throw new Error("email da ton tai");
      } else {
        bcrypt.hash(req.body.password, 12).then((hashPassword) => {
          const user = new User({
            email: req.body.email,
            password: hashPassword,
            phoneNumber: req.body.phone,
            fullName: req.body.fullName,
          });
          user.save().then(() => {
            res.status(200).json({
              status: 200,
              message: "sign up successfully",
            });
          });
        });
      }
    })
    .catch((err) => {
      next(err.message);
    });
};

// login
exports.postLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors.array()[0].msg);
  }
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        throw new Error("email not found");
      } else {
        bcrypt.compare(req.body.password, user.password).then((comparePass) => {
          if (comparePass) {
            req.session.islogin = true;
            req.session.user = user;
            res.status(200).json({
              status: 200,
              message: "login successful",
              data: { fullName: user.fullName, role: user.role },
            });
          }
        });
      }
    })
    .catch((err) => {
      next(err.message);
    });
};
