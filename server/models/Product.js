import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minLength: 5,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  priceType: {
    type: String,
    enum: ["kg", "dozen", "g", "crate", "l", "ml", "piece"], //add more later
    required: true,
  },
  negotiate: {
    type: Boolean,
    required: true,
  },
  productType: {
    type: String,
    enum: ["fruits", "vegetables", "cereals"], //add more later (will be used for filter based search for users)
  },
  image: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

export default Product;
