import Joi from "joi";

const productImageSchema = Joi.object({
  originalname: Joi.string().required(), // Original file name
  mimetype: Joi.string()
    .regex(/^image\//)
    .message({ "any.required": "File must be an image" })
    .required(),
  size: Joi.number()
    .max(5 * 1024 * 1024) // 5MB limit
    .message({ "any.required": "File size must be less than 5MB" })
    .required(),
  path: Joi.string().required(),
});

const imageSchema = Joi.alternatives().try(
  productImageSchema,
  Joi.string()
    .pattern(/^(?!\s*$)(?!.*\s).+/)
    .message({ "any.required": "Image is required" })
);

export const productValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string()
    .min(5)
    .required()
    .messages({ "any.required": "Description is required" }),

  price: Joi.number()
    .min(0)
    .required()
    .messages({ "any.required": "Price is required" }),

  priceType: Joi.string()
    .valid("kg", "dozen", "g", "crate", "l", "ml", "piece") // add more if needed later
    .required()
    .messages({ "any.required": "Price type is required" }),
  productType: Joi.string().valid("fruits", "vegetables", "cereals").messages({
    "any.required":
      "Product type must be one of fruits, vegetables, or cereals",
  }),
  image: imageSchema,
  negotiate: Joi.boolean()
    .required()
    .messages({ "any.required": "Negotiate option is required" }),
});

export const orderValidationSchema = Joi.object({
  productName: Joi.string()
    .required()
    .messages({ "any.required": "Product name is required" }),
  productImage: Joi.string()
    .required()
    .messages({ "any.required": "Product image is required" }),
  deliveryPrice: Joi.number()
    .default(0)
    .min(0)
    .messages({ "any.required": "Delivery price cannot be negative" }),
  productPrice: Joi.number().required().min(1).messages({
    "number.base": "Product price must be a number",
    "number.min": "Product price must be at least 1",
    "any.required": "Product price is required",
  }),
  address: Joi.string().required().messages({
    "string.empty": "Address is required",
  }),
  pincode: Joi.string()
    .pattern(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid pincode",
      "any.required": "Pincode is required",
    }),
});
