import mongoose from "mongoose";
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: true,
    minLength: 3,
    match: [/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@gmail\.com$/, "Invalid email"],
  },
  phoneNumber: {
    type: Number,
    required: true,
    min: 10,
    match: [/^\+91[6-9]\d{9}$/, "Invalid contact number"],
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  cart: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  ordersReceived: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  ordersPlaced: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

export default User;
