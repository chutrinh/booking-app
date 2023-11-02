const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const User = require("../model/user-model");

const authController = require("../controller/auth-controller");
const { isAuth, checkRole } = require("../middleware/isAuth");

router.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
});

// sign up
router.post(
  "/sign-up",
  [
    body("email")
      .notEmpty()
      .withMessage("Please enter your email")
      .isEmail()
      .withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Please enter your password"),
    body("fullName").notEmpty().withMessage("Please enter your fullname"),
    body("phone")
      .notEmpty()
      .withMessage("Please enter your phone")
      .isFloat()
      .withMessage("Please enter your phone number"),
  ],
  authController.postSignup
);

// login user
router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("Please enter your email")
      .isEmail()
      .withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Please enter your password"),
  ],
  authController.postLogin
);

// login admin
router.post(
  "/admin/login",
  [
    body("email")
      .notEmpty()
      .withMessage("Please enter your email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((values, { req }) => {
        return new Promise((resolve, reject) => {
          User.findOne({ email: values }).then((user) => {
            if (user) {
              if (!["consultant", "admin"].includes(user.role)) {
                reject("Email này không phải là admin");
              }
              resolve(true);
            } else {
              reject("Email khong ton tai");
            }
          });
        });
      }),
    body("password").notEmpty().withMessage("Please enter your password"),
  ],
  authController.postLogin
);

// kiểm tra đăng nhập
router.get(
  "/check",
  isAuth,
  checkRole(["customer", "consultant", "admin"]),
  (req, res, next) => {
    res.status(200).json({ status: 200, message: "trạng thái đã logigged" });
  }
);

// logout
router.post(
  "/logout",
  isAuth,
  checkRole(["customer", "consultant", "admin"]),
  (req, res, next) => {
    req.session.destroy((err) => {
      res.status(200).json({ status: 200, message: "logout thành công" });
    });
  }
);

module.exports = router;
