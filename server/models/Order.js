import mongoose, { mongo } from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  deliveryPrice: {
    type: Number,
    default: 0,
  },
  productPrice: {
    type: Number,
    required: true,
    min: 1,
  },
  address: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
    match: ["^[1-9]{1}[0-9]{2}s{0, 1}[0-9]{3}$", "Invalid pincode"],
  },

  processing: {
    type: Boolean,
    default: true,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  productDetails: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  orderedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  productOwner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
