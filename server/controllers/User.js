import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

export const signUp = async (req, res) => {
  let signUpError = false;
  const { username, email, phoneNumber, password } = req.body;

  const newUser = new User({
    username: username,
    email: email,
    phoneNumber: Number(phoneNumber),
  });

  const registeredUserr = await User.register(newUser, password).catch(
    (err) => {
      console.log("signUpError", err);
      signUpError = true;
      //   res.json("signUpError");
    }
  );

  if (!signUpError) {
    req.login(registeredUserr, (err) => {
      if (err) {
        console.log("signUpLoginError", err);
        res.json({ success: false, message: "signUpError" });
      } else {
        res.json({
          success: true,
          message: "successSignUp",
        });
      }
    });
  } else {
    res.json({
      success: false,
      message: "signUpError",
    });
  }
};

export const login = (req, res) => {
  res.json({
    success: true,
    message: "successLogin",
  });
};

export const failureLogin = (req, res) => {
  res.json({
    success: false,
    message: "failureLogin",
  });
};

export const logout = (req, res) => {
  req.logout((err) => {
    console.log(err);
    if (err) {
      res.json({
        success: false,
        message: "logOutError",
      });
    } else {
      res.json({
        success: true,
        message: "successLogOut",
      });
    }
  });
};

export const addToCart = async (req, res) => {
  const { id } = req.params;

  const product = await User.findByIdAndUpdate(req.user.id, {
    $push: { cart: id },
  }).catch((err) => console.log("Product not found errro"));

  if (!product) {
    res.json({
      success: false,
      message: "productNotFound",
    });
  } else {
    res.json({
      success: true,
      message: "productAddedToCart",
    });
  }
};

export const removeFromCart = async (req, res) => {
  const { id } = req.params;
  const updatedUser = await User.findByIdAndUpdate(req.user?.id, {
    $pull: { cart: id },
  }).catch((err) => "product not found errpr");

  if (updatedUser) {
    res.json({
      success: true,
      message: "removedFromCart",
    });
  } else if (!updatedUser) {
    res.json({
      success: false,
      message: "productNotFoundInCart",
    });
  }
};

export const placeOrder = async (req, res) => {
  const { id } = req.params;

  console.log("place Order Requets Body", req.body);

  const product = await Product.findById(id)
    .populate("owner")
    .catch((err) => console.log("product not found error"));

  if (!product) {
    res.json({
      success: false,
      message: "productNotFound",
    });
  } else {
    const newOrder = new Order(req.body);
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const date = now.getDate().toString().padStart(2, "0");

    const orderDateString = `${year}-${month}-${date}`;
    newOrder.date = orderDateString;
    newOrder.productDetails = id;
    newOrder.orderedBy = req.user?.id;
    newOrder.productOwner = product.owner._id;
    const placedOrder = await newOrder.save();

    product.orders.push(placedOrder);

    await product.save();

    const addNotificationsToFarmer = await User.findByIdAndUpdate(
      product.owner._id,
      {
        $push: { notifications: placedOrder, ordersReceived: placedOrder },
      }
    ).catch((err) => console.log("owner not found error"));

    if (!addNotificationsToFarmer) {
      res.json({
        success: false,
        message: "ownerNotFound",
      });
    } else {
      const userOrdersPlaced = await User.findByIdAndUpdate(req.user?.id, {
        $push: { ordersPlaced: placedOrder },
      });
      res.json({
        success: true,
        message: "orderPlaced",
        orderId: placedOrder._id,
      });
    }
  }
};

export const filterSearch = async (req, res) => {
  const products = await Product.find(req.query);

  res.json({
    success: true,
    message: "productsFound",
    products: products,
  });
};

export const getCartDetails = async (req, res) => {
  const user = await User.findById(req.user?.id).populate({
    path: "cart",
    populate: { path: "owner" },
  });
  res.json({
    success: true,
    message: "cartDetailsFound",
    cart: user.cart,
  });
};

export const getOrdersPlacedDetails = async (req, res) => {
  const user = await User.findById(req.user?.id).populate({
    path: "ordersPlaced",
    populate: {
      path: "productOwner",
    },
  });
  res.json({
    success: true,
    message: "cartDetailsFound",
    placedOrders: user.ordersPlaced,
  });
};

export const getOrdersReceivedDetails = async (req, res) => {
  const user = await User.findById(req.user?.id).populate({
    path: "ordersReceived",
    populate: {
      path: "orderedBy",
    },
  });
  console.log(user.ordersReceived);
  res.json({
    success: true,
    message: "cartDetailsFound",
    receivedOrders: user.ordersReceived,
  });
};

export const loggedIn = (req, res) => {
  res.json({
    success: true,
    message: "loggedIn",
  });
};

export const userProducts = async (req, res) => {
  const data = await User.findById(req.user.id).populate("products");

  res.json({
    success: true,
    products: data.products,
    message: "products Fetched",
  });
};

export const getOrderDetails = async (req, res) => {
  const { id } = req.params;
  console.log("Order Id", id);
  console.log("getOrderDetails");
  const orderData = await Order.findById(id)
    .populate("productDetails")
    .populate("productOwner")
    .populate("orderedBy")
    .catch((err) => console.log("Order Not Foubnd Error", err));

  console.log("orderData", orderData);

  if (!orderData) {
    res.json({
      success: false,
      message: "Order Not Found",
    });
  } else {
    console.log("order Details Success");
    console.log(orderData);
    res.json({
      success: true,
      message: "Order Details Found",
      orderDetails: orderData,
    });
  }
};

export const getNotifications = async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "notifications",
    populate: { path: "orderedBy" },
  });
  // .populate("orderedBy");

  console.log("notifications", user.notifications);

  res.json({
    message: "data Fetched",
    success: true,
    notifications: user.notifications,
  });
};
export default {
  signUp,
  login,
  failureLogin,
  addToCart,
  placeOrder,
  filterSearch,
  getCartDetails,
  getOrdersPlacedDetails,
  getOrdersReceivedDetails,
  logout,
  removeFromCart,
  loggedIn,
  userProducts,
  getOrderDetails,
  getNotifications,
};
