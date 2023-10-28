const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const adminComtroller = require("../controller/admin-controller");
const { isAuth, checkRole } = require("../middleware/isAuth");

router.get(
  "/product",
  isAuth,
  checkRole(["admin"]),
  adminComtroller.getProduct
);

router.get(
  "/product/search-product",
  isAuth,
  checkRole(["admin"]),
  adminComtroller.getSearchProduct
);

router.post(
  "/product/add-product",
  isAuth,
  checkRole(["admin"]),
  [
    body("name").notEmpty().withMessage("vui lòng nhập name"),
    body("category").notEmpty().withMessage("vui lòng nhập category"),
    body("price").notEmpty().withMessage("vui lòng nhập price"),
    body("count").notEmpty().withMessage("vui lòng nhập count"),
    body("shortDesc").notEmpty().withMessage("vui lòng nhập shortDesc"),
    body("longDesc").notEmpty().withMessage("vui lòng nhập longDesc"),
  ],
  checkRole(["admin"]),
  adminComtroller.postAddProduct
);

router.post(
  "/product/delete-product",
  isAuth,
  checkRole(["admin"]),
  adminComtroller.postDeleteProduct
);

router.get(
  "/product/edit-product/:productId",
  isAuth,
  checkRole(["admin"]),
  adminComtroller.getEditProduct
);

router.post(
  "/product/edit-product/:productId",
  isAuth,
  checkRole(["admin"]),
  [
    body("name").notEmpty().withMessage("vui lòng nhập name"),
    body("category").notEmpty().withMessage("vui lòng nhập category"),
    body("price").notEmpty().withMessage("vui lòng nhập price"),
    body("count").notEmpty().withMessage("vui lòng nhập count"),
    body("shortDesc").notEmpty().withMessage("vui lòng nhập shortDesc"),
    body("longDesc").notEmpty().withMessage("vui lòng nhập longDesc"),
  ],
  checkRole(["admin"]),
  adminComtroller.postEditProduct
);

// order
router.get("/order", isAuth, checkRole(["admin"]), adminComtroller.getOrder);

module.exports = router;
