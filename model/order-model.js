const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: { type: Object, required: true },
    product: [
      {
        productId: { type: Object, required: true },
        amount: { type: Number, required: true },
      },
    ],
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    total: { type: Number, required: true },
    status: { type: String, required: true },
    delivery: { type: String, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("ordes", orderSchema);
