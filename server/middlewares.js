import Product from "./models/Product.js";
import User from "./models/User.js";
import {
  orderValidationSchema,
  productValidationSchema,
} from "./schemeValidations.js";
import expressError from "./utils/expressError.js";
import cloudinary from "cloudinary";

export const checkLogin = (req, res, next) => {
  console.log("checkLogin");
  if (!req.isAuthenticated()) {
    res.json({
      success: false,
      message: "notLogin",
    });
  } else {
    next();
  }
};

export const isOwner = async (req, res, next) => {
  const { id } = req.params;
  if (!req.isAuthenticated()) {
    res.json({
      success: false,
      message: "notLogin",
    });
  } else {
    const product = await Product.findById(id).catch((err) =>
      console.log("product not found error")
    );
    if (product) {
      if (product.owner.equals(req.user?.id)) {
        next();
      } else {
        res.json({
          success: false,
          message: "noOwner",
        });
      }
    } else if (!product) {
      res.json({
        success: false,
        message: "productNotExists",
      });
    }
  }
};

export const checkAlreadyAddedToCart = async (req, res, next) => {
  const { id } = req.params;
  if (!req.isAuthenticated()) {
    res.json({
      success: false,
      message: "notLogin",
    });
  } else {
    const product = await Product.findById(id).catch((err) =>
      console.log("product not found error")
    );
    if (!product) {
      res.json({
        success: false,
        message: "productDoesNotExists",
      });
    } else if (product) {
      const user = await User.findById(req.user?.id);
      const cartProducts = user.cart;
      let productPresentInCart = false;
      for (const cartProduct of cartProducts) {
        if (cartProduct.equals(id)) {
          productPresentInCart = true;
        }
      }
      if (productPresentInCart) {
        res.json({
          success: false,
          message: "alreadyInCart",
        });
      } else {
        next();
      }
    }
  }
};

export const alreadyLoginCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({
      success: false,
      message: "alreadyLoggedIn",
    });
  } else {
    next();
  }
};

export const validateProductSchema = (req, res, next) => {
  const data = JSON.parse(JSON.stringify(req.body));
  console.log("productSchema", data);
  console.log("image", req.file ? req.file.path : "No image file");
  const dataToValidate = {
    title: data.title,
    description: data.description,
    price: data.price,
    priceType: data.priceType,
    negotiate: data.negotiate,
    productType: data.productType,
    image: req.file ? req.file.path : data.image,
  };
  const { error } = productValidationSchema.validate(dataToValidate);

  if (error) {
    let errorMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(422, errorMsg);
  }

  next();
};

export const validateOrderSchema = (req, res, next) => {
  const { error } = orderValidationSchema.validate(
    JSON.parse(JSON.stringify(req.body))
  );

  if (error) {
    let errorMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(422, errorMsg);
  }

  next();
};

export const cloudinaryErrorHandler = (err, req, res, next) => {
  if (err) {
    console.error("Cloudinary Error:", err);

    // // Check for specific Cloudinary error codes
    // if (err instanceof cloudinary.errors.UploadError) {
    //   return res.status(500).json({
    //     message: "Failed to upload image to Cloudinary.",
    //     error: err.message,
    //   });
    // }

    // Handle other errors
    return res.status(500).json({
      message: "An error occurred during the file upload.",
      error: err.message || "Unknown error",
    });
  }

  // If there's no error, proceed to the next middleware
  next();
};
