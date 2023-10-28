const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const homeController = require("../controller/home-controller");
const { isAuth, checkRole } = require("../middleware/isAuth");

// router.get("/", (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Max-Age", "1800");
//   res.setHeader("Access-Control-Allow-Headers", "content-type");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "PUT, POST, GET, DELETE, PATCH, OPTIONS"
//   );
// });

router.get("/", homeController.getProduct);
router.get("/chatClient", homeController.getChatClient);
router.get("/detai-product/:productId", homeController.getModalProduct);
router.post(
  "/add-to-cart",
  isAuth,
  checkRole(["customer", "consultant", "admin"]),
  homeController.postAddToCart
);
router.get("/cart/get-cart", isAuth, homeController.getCart);
router.post(
  "/cart/delete-product",
  isAuth,
  checkRole(["customer", "consultant", "admin"]),
  homeController.postDeleteProduct
);
router.post(
  "/cart/update-cart",
  isAuth,
  checkRole(["customer", "consultant", "admin"]),
  homeController.postUpdateCart
);
router.get(
  "/history/get-order",
  isAuth,
  checkRole(["customer", "consultant", "admin"]),
  homeController.getOrder
);
router.post(
  "/order/add-order",
  isAuth,
  checkRole(["customer", "consultant", "admin"]),
  [
    body("name").notEmpty().withMessage("vui lòng nhận thông tin name"),
    body("email").notEmpty().withMessage("vui lòng nhận thông tin email"),
    body("phone").notEmpty().withMessage("vui lòng nhận thông tin phone"),
    body("address").notEmpty().withMessage("vui lòng nhận thông tin address"),
  ],
  homeController.postAddOrder
);

module.exports = router;
