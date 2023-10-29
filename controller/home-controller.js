const Product = require("../model/product-model");
const Order = require("../model/order-model");
const User = require("../model/user-model");
const nodemailer = require("nodemailer");
// const mongodb = require("mongodb");
require("dotenv").config();
const { validationResult } = require("express-validator");
const Chat = require("../model/session-chat-model");

// cấu hình gửi mail
const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.email,
    pass: process.env.pass,
  },
});

exports.getProduct = (req, res, next) => {
  console.log("get cookie:", req.session)
  Product.find()
    .then((product) => {
      if (product.length > 0) {
        res
          .status(200)
          .json({ status: 200, message: "success", data: product });
      } else {
        throw new Error("Product not found");
      }
    })
    .catch((error) => {
      next(error.message);
    });
};

exports.getModalProduct = (req, res, next) => {
  if (!req.params.productId) {
    return next("không tìm thấy sản phẩm");
  }
  Product.findOne({ _id: req.params.productId })
    .then((product) => {
      if (!product) {
        throw new Error("Product not found");
      } else {
        res
          .status(200)
          .json({ status: 200, message: "success", data: product });
      }
    })
    .catch((error) => {
      next(error.message);
    });
};

// add to cart
exports.postAddToCart = (req, res, next) => {
  const prodId = req.body.productId;
  const amount = req.body.amount;
  Product.findOne({ _id: prodId })
    .then((product) => {
      if (product) {
        const index = req.user.cart.findIndex(
          (item) => item.productId.toString() === prodId.toString()
        );
        if (index >= 0) {
          if (req.user.cart[index].amount + amount > product.count) {
            throw new Error(
              `bạn chỉ có thể thêm ${
                product.count - req.user.cart[index].amount
              } sản phẩm`
            );
          }
          req.user.cart[index].amount += amount;
          req.user.save().then(() => {
            res.status(200).json({
              status: 200,
              message: "thêm sản phẩm vào giỏ hàng thành công",
            });
          });
        } else {
          req.user.cart.push({ productId: product._id, amount: amount });
          req.user.save().then(() => {
            res.status(200).json({
              status: 200,
              message: "thêm sản phẩm vào giỏ hàng thành công",
            });
          });
        }
      } else {
        throw new Error("Cannot find product");
      }
    })
    .catch((error) => {
      next(error.message);
    });
};

// get cart
exports.getCart = (req, res, next) => {
  const products = req.user.cart.map(async (item) => {
    const product = await Product.findOne({ _id: item.productId });
    if (product) {
      return { product, amount: item.amount };
    }
  });
  Promise.all(products).then((result) => {
    Order.findOne({ "user._id": req.user._id })
      .then((order) => {
        if (order) {
          res.status(200).json({
            status: 200,
            message: "get cart successfully",
            data: result,
            inforUser: {
              name: order.name,
              phone: order.phone,
              address: order.address,
              email: order.email,
            },
          });
        } else {
          res.status(200).json({
            status: 200,
            message: "get cart successfully",
            data: result,
            inforUser: {
              name: "",
              phone: "",
              address: "",
              email: "",
            },
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  });
};

// delete product
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const index = req.user.cart.findIndex(
    (item) => item.productId.toString() === prodId.toString()
  );
  if (index >= 0) {
    const updateCart = req.user.cart.filter(
      (item) => item.productId.toString() !== prodId.toString()
    );
    req.user.cart = updateCart;
    req.user.save().then(() => {
      res.status(200).json({ status: 200, message: "Product deleted" });
    });
  } else {
    next("Product not found");
  }
};

// update cart
exports.postUpdateCart = (req, res, next) => {
  const prodId = req.body.productId;
  const action = req.body.action;
  const index = req.user.cart.findIndex(
    (item) => item.productId.toString() === prodId.toString()
  );
  if (index >= 0) {
    if (action === "INCREMENT") {
      Product.findOne({ _id: prodId })
        .then((product) => {
          if (product) {
            if (req.user.cart[index].amount !== product.count) {
              req.user.cart[index].amount += 1;
              return req.user.save();
            } else {
              throw new Error(
                "sản phẩm này trong giỏ hàng của bạn đã vượt quá số lượng sản phẩm cho phép"
              );
            }
          } else {
            throw new Error("tăng số lượng sản phẩm không thành công");
          }
        })
        .then(() => {
          res.status(200).json({
            status: 200,
            message: "Product updated successfully",
          });
        })
        .catch((error) => {
          next(error.message);
        });
    }
    if (action === "DECREMENT") {
      req.user.cart[index].amount -= 1;
      req.user
        .save()
        .then(() => {
          res.status(200).json({
            status: 200,
            message: "Product updated successfully",
          });
        })
        .catch((error) => {
          next(error.message);
        });
    }
  } else {
    next("Product not found");
  }
};

// add order
exports.postAddOrder = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors.array()[0].msg);
  }
  User.findOne({ _id: req.user._id })
    .populate("cart.productId")
    .exec()
    .then((user) => {
      return new Promise((resolve, reject) => {
        if (user.cart.length > 0) {
          const order = new Order({
            user: user,
            product: user.cart,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            status: "waiting for payment",
            delivery: "waiting for processing",
            total: user.cart.reduce(
              (curr, item) => (curr += item.productId.price * item.amount),
              0
            ),
          });
          order
            .save()
            .then((order) => {
              return new Promise((resolve, reject) => {
                if (!order) {
                  reject(new Error("order không thành công"));
                } else {
                  transport
                    .sendMail({
                      from: `test node mailer <${process.env.email}>`,
                      to: req.body.email,
                      // to: process.env.email,
                      subject: "hello",
                      text: "tôi là trình",
                      html: `<body>
                  <h1>Xin Chào User ${req.user.fullName}</h1>
                  <p>Phone: ${req.body.phone}</p>
                  <p>Address: ${req.body.address}</p>
                  <table border="1" style="border-collapse: collapse; width: 70%">
                    <thead>
                      <tr style="text-align: center">
                        <th style="width: 50%">tên sản phẩm</th>
                        <th style="width: 20%">hình ảnh</th>
                        <th style="width: 10%">giá</th>
                        <th style="width: 10%">số lượng</th>
                        <th style="width: 10">thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                    ${user.cart.map((item) => {
                      return `<tr style="text-align: center">
                        <td>${item.productId.name}</td>
                        <td>
                          <img
                            style="width: 100%"
                            src="${item.productId.img1}"
                            alt=""
                          />
                        </td>
                        <td>${item.productId.price} vnd</td>
                        <td>${item.amount}</td>
                        <td>${item.productId.price * item.amount}</td>
                      </tr>`;
                    })}
                    </tbody>
                  </table>
                  <h1>Tổng thanh toán</h1>
                  <h2>${user.cart.reduce(
                    (curr, item) =>
                      (curr += item.productId.price * item.amount),
                    0
                  )} vnd</h2>
                  <h1>Cảm ơn bạn</h1>
                </body>`,
                    })
                    .then(() => {
                      resolve();
                    });
                }
              });
            })
            .then(() => {
              const data = req.user.cart.map(async (item) => {
                const product = await Product.findOne({ _id: item.productId });
                if (product) {
                  product.count -= item.amount;
                }
                return product.save();
              });
              Promise.all(data).then(() => {
                req.user.cart = [];
                req.user.save().then(() => {
                  res.status(200).json({
                    status: 200,
                    message:
                      "order successfuly, please check your email to see detail! thanks",
                  });
                });
              });
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          reject(new Error("cart empty!"));
        }
      });
    })
    .catch((error) => {
      next(error.message);
    });
};

// get order
exports.getOrder = (req, res, next) => {
  Order.find({ "user._id": req.user._id }) // Chú ý sử dụng 'user._id' ở đây
    .then((orders) => {
      if (orders.length > 0) {
        res.status(200).json({
          status: 200,
          message: "success",
          data: orders,
        });
      } else {
        throw new Error("Not Found Order");
      }
    })
    .catch((err) => {
      next(err.message);
    });
};

exports.getChatClient = (req, res, next) => {
  Chat.find()
    .then((userChat) => {
      if (userChat) {
        res
          .status(200)
          .json({ status: 200, message: "get success", data: userChat });
      } else {
        throw new Error("không tìm thấy user-chat");
      }
    })
    .catch((err) => {
      next(err.message);
    });
};

/*

exports.postAddOrder = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors.array()[0].msg);
  }
  User.findOne({ _id: req.user._id })
    .populate("cart.productId")
    .exec()
    .then((user) => {
      if (user.cart.length > 0) {
        return new Promise((resolve, reject) => {
          const order = new Order({
            user: user,
            product: user.cart,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            status: "waiting for payment",
            delivery: "waiting for processing",
            total: user.cart.reduce(
              (curr, item) => (curr += item.productId.price * item.amount),
              0
            ),
          });
          order
            .save()
            .then(() => {
              return transport.sendMail({
                from: `test node mailer <${process.env.email}>`,
                to: req.body.email,
                // to: process.env.email,
                subject: "hello",
                text: "tôi là trình",
                html: `<body>
                  <h1>Xin Chào User ${req.user.fullName}</h1>
                  <p>Phone: ${req.body.phone}</p>
                  <p>Address: ${req.body.address}</p>
                  <table border="1" style="border-collapse: collapse; width: 70%">
                    <thead>
                      <tr style="text-align: center">
                        <th style="width: 50%">tên sản phẩm</th>
                        <th style="width: 20%">hình ảnh</th>
                        <th style="width: 10%">giá</th>
                        <th style="width: 10%">số lượng</th>
                        <th style="width: 10">thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                    ${user.cart.map((item) => {
                      return `<tr style="text-align: center">
                        <td>${item.productId.name}</td>
                        <td>
                          <img
                            style="width: 100%"
                            src="${item.productId.img1}"
                            alt=""
                          />
                        </td>
                        <td>${item.productId.price} vnd</td>
                        <td>${item.amount}</td>
                        <td>${item.productId.price * item.amount}</td>
                      </tr>`;
                    })}
                    </tbody>
                  </table>
                  <h1>Tổng thanh toán</h1>
                  <h2>${user.cart.reduce(
                    (curr, item) =>
                      (curr += item.productId.price * item.amount),
                    0
                  )} vnd</h2>
                  <h1>Cảm ơn bạn</h1>
                </body>`,
              });
            })
            .then(() => {
              req.user.cart = [];
              req.user.save().then(() => {
                res.status(200).json({
                  status: 200,
                  message:
                    "order successfuly, please check your email to see detail! thanks",
                });
              });
            })
            .catch((err) => {
              reject({ message: err.message });
            });
        });
      } else {
        throw new Error("cart empty!");
      }
    })
    .catch((error) => {
      next(error.message);
    });
};


*/
