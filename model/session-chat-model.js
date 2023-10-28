const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionChatSchema = new Schema({
  roomId: {
    type: String,
    required: true,
  },
  content: {
    type: Array,
    required: true,
  },
});
module.exports = mongoose.model("chat", sessionChatSchema);
