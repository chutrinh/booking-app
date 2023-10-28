const Product = require("../model/product-model");
const Order = require("../model/order-model");
const User = require("../model/user-model");
const { validationResult } = require("express-validator");

exports.getProduct = (req, res, next) => {
  Product.find()
    .then((products) => {
      if (products.length > 0) {
        res.status(200).json({
          status: 200,
          message: "get product successfuly",
          data: products,
        });
      } else {
        throw new Error("Not Found Product!");
      }
    })
    .catch((err) => {
      next(err.message);
    });
};

exports.getSearchProduct = (req, res, next) => {
  const keywordSearch = req.query.keyword;
  Product.find()
    .then((products) => {
      if (products.length > 0) {
        const searchProduct = products.filter((product) => {
          if (
            product.name
              .toLocaleLowerCase()
              .includes(keywordSearch.toLocaleLowerCase())
          ) {
            return product;
          }
        });
        if (!searchProduct.length > 0) {
          throw new Error("Not Found Product!");
        }
        res.status(200).json({
          status: 200,
          message: "get product successfuly",
          data: searchProduct,
        });
      } else {
        throw new Error("Not Found Product!");
      }
    })
    .catch((err) => {
      next(err.message);
    });
};

exports.postAddProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors.array()[0].msg);
  }
  if (req.files.length === 0) {
    return next("vui lòng chọn ảnh");
  }
  if (req.files.length !== 4) {
    return next("chỉ chọn 4 file ảnh");
  }
  const product = new Product({
    name: req.body.name,
    category: req.body.category,
    img1: req.files[0].path,
    img2: req.files[1].path,
    img3: req.files[2].path,
    img4: req.files[3].path,
    price: req.body.price,
    count: req.body.count,
    short_desc: req.body.shortDesc,
    long_desc: req.body.longDesc,
  });
  product
    .save()
    .then((result) => {
      if (result) {
        res
          .status(200)
          .json({ status: 200, message: "add product successfully" });
      } else {
        throw new Error("Could not add product");
      }
    })
    .catch((error) => {
      next(error.message);
    });
};

// delete product
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove({ _id: prodId })
    .then((product) => {
      if (product) {
        res
          .status(200)
          .json({ status: 200, message: "delete product successfully" });
      } else {
        throw new Error("Could not delete product");
      }
    })
    .catch((error) => {
      next(error.message);
    });
};

// edit
exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findOne({ _id: prodId })
    .then((product) => {
      if (product) {
        res
          .status(200)
          .json({ status: 200, message: "find successfully", data: product });
      } else {
        throw new Error("Could not found product");
      }
    })
    .catch((error) => {
      next(error.message);
    });
};

// post edit
exports.postEditProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors.array()[0].msg);
  }
  if (req.files.length === 0) {
    return next("vui lòng chọn ảnh");
  }
  if (req.files.length !== 4) {
    return next("chỉ chọn 4 file ảnh");
  }
  const prodId = req.params.productId;
  Product.findOne({ _id: prodId })
    .then((product) => {
      if (product) {
        product.name = req.body.name;
        product.category = req.body.category;
        product.img1 = req.files[0].path;
        product.img2 = req.files[1].path;
        product.img3 = req.files[2].path;
        product.img4 = req.files[3].path;
        product.price = req.body.price;
        product.count = req.body.count;
        product.short_desc = req.body.shortDesc;
        product.long_desc = req.body.longDesc;
        product.save().then((product) => {
          res.status(200).json({ status: 200, message: "update successfully" });
        });
      } else {
        throw new Error("Could not update product");
      }
    })
    .catch((error) => {
      next(error.message);
    });
};

// order
exports.getOrder = (req, res, next) => {
  Order.find()
    .then((order) => {
      if (order.length > 0) {
        return order;
      } else {
        throw new Error("Could not find order");
      }
    })
    .then((order) => {
      return new Promise((resolve, reject) => {
        User.find().then((user) => {
          if (user.length > 0) {
            resolve({ order, userNumber: user.length });
          } else {
            reject(new Error("Could not find user"));
          }
        });
      });
    })
    .then((result) => {
      res.status(200).json({
        status: 200,
        message: "order found",
        data: { order: result.order, userNumber: result.userNumber },
      });
    })
    .catch((error) => {
      next(error.message);
    });
};
