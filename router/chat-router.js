const express = require("express");
const router = express.Router();
const { isAuth, checkRole } = require("../middleware/isAuth");
const chatController = require("../controller/chat-controller");

router.get(
  "/",
  isAuth,
  checkRole(["consultant", "admin"]),
  chatController.getChat
);

module.exports = router;
