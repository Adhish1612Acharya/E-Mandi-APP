import express from "express";
import listingController from "../controllers/listing.js";
import userController from "../controllers/User.js";
import wrapAsync from "../utils/wrapAsync.js";
import {
  checkAlreadyAddedToCart,
  checkLogin,
  cloudinaryErrorHandler,
  isOwner,
  validateOrderSchema,
  validateProductSchema,
} from "../middlewares.js";
import multer from "multer";
import { storage } from "../cloudConfig.js";
const upload = multer({ storage });

const router = express.Router();

router.get("/", checkLogin, wrapAsync(listingController.getProducts));

router.get("/filterSearch", wrapAsync(userController.filterSearch));

router.get("/:id", checkLogin, wrapAsync(listingController.getProductDetail));

router.put(
  "/:id/cart",
  checkAlreadyAddedToCart,
  wrapAsync(userController.addToCart)
);

router.delete("/:id/cart", wrapAsync(userController.removeFromCart));

router.get(
  "/:id/cart",
  checkAlreadyAddedToCart,
  wrapAsync(userController.addToCart)
);

router.post(
  "/:id/order",
  checkLogin,
  validateOrderSchema,
  wrapAsync(userController.placeOrder)
);

router.post(
  "/",
  checkLogin,
  upload.single("image"),
  cloudinaryErrorHandler,
  validateProductSchema,
  wrapAsync(listingController.createListing)
);

router.put(
  "/:id",
  isOwner,
  upload.single("image"),
  validateProductSchema,
  wrapAsync(listingController.editListing)
);

router.delete("/:id", isOwner, wrapAsync(listingController.deleteListing));

export default router;
