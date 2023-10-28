const Chat = require("../model/session-chat-model");

exports.getChat = (req, res, next) => {
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
