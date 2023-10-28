const mongoose = require("mongoose");
const Shema = mongoose.Schema;

const userShema = new Shema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  cart: [
    {
      productId: {
        type: Shema.Types.ObjectId,
        required: true,
        ref: "products",
      },
      amount: { type: Number, required: true },
    },
  ],
  role: {
    type: String,
    emun: ["customer", "consultant", "admin"],
    default: "customer",
  },
});
module.exports = mongoose.model("users", userShema);
