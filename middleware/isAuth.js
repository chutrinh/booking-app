const User = require("../model/user-model");

exports.isAuth = (req, res, next) => {
  if (!req.session.islogin) {
    return next("vui lòng đăng nhập tài khoản");
  }
  User.findOne({ _id: req.session.user._id })
    .then((user) => {
      if (user) {
        req.user = user;
        return next();
      }
      throw new Error("User not found");
    })
    .catch((err) => {
      next(err.message);
    });
};

// cái này được gọi là customer middleware
exports.checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (allowedRoles.includes(req.user.role)) {
      next(); // Nếu người dùng có quyền, cho phép tiếp tục
    } else {
      next("Không có quyền truy cập.");
    }
  };
};
