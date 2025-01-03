import Product from "../models/Product.js";
import User from "../models/User.js";

export const getProducts = async (req, res) => {
  const products = await Product.find({}).populate("owner");
  res.json({
    success: true,
    message: "dataFetched",
    products: products,
  });
};

export const getProductDetail = async (req, res) => {
  const { id } = req.params;

  const productDetail = await Product.findById(id)
    .populate("owner")
    .catch((err) => "Product not found error");

  console.log(productDetail);

  if (!productDetail) {
    res.json({
      success: false,
      message: "productNotFound",
    });
  } else {
    let owner = false;
    if (productDetail.owner.equals(req.user._id)) {
      owner = true;
    }
    console.log("ownership : ", owner);
    res.json({
      success: true,
      message: "productDetailFound",
      productDetail: productDetail,
      isOwner: owner,
    });
  }
};

export const createListing = async (req, res) => {
  const { title, description, price, priceType, negotiate, productType } =
    req.body;

  console.log("craeteLitingReauet", req.body);

  console.log("file", req.file.path);

  const newProduct = new Product({
    title,
    description,
    price,
    priceType,
    negotiate,
    productType,
    image: req.file?.path || req.body.image,
  });

  newProduct.owner = req.user.id;

  await newProduct.save();

  await User.findByIdAndUpdate(req.user?.id, {
    $push: { products: newProduct },
  });

  console.log("New product created");
  res.json({
    success: true,
    message: "newProductAdded",
    id: newProduct._id,
  });
};

export const editListing = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, priceType, negotiate, productType } =
    req.body;

  const editedProduct = await Product.findByIdAndUpdate(
    id,
    {
      title,
      description,
      price,
      priceType,
      negotiate,
      productType,
      image: req.file?.path || req.body.image,
    },
    { new: true }
  ).catch((err) => console.log("product not found  error"));

  if (!editedProduct) {
    res.json({
      success: false,
      message: "productNotFound",
    });
  } else {
    res.json({
      success: true,
      message: "newProductEdited",
      editedProduct: editedProduct,
    });
  }
};

export const deleteListing = async (req, res) => {
  const { id } = req.params;

  const deletedProduct = await Product.findByIdAndDelete(id).catch((err) =>
    console.log("product not found error")
  );

  if (deletedProduct) {
    await User.updateMany({ $pull: { cart: id } });
    await User.findByIdAndUpdate(req.user.id, { $pull: { products: id } });
    res.json({
      success: true,
      message: "productDeleted",
    });
  } else if (!deletedProduct) {
    res.json({
      success: false,
      message: "productNotFound",
    });
  }
};

export default {
  getProducts,
  getProductDetail,
  createListing,
  editListing,
  deleteListing,
};
