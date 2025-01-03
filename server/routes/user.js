import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import userController from "../controllers/User.js";
import { alreadyLoginCheck, checkLogin } from "../middlewares.js";
import passport from "passport";

const router = express.Router();

router.post("/signUp", alreadyLoginCheck, wrapAsync(userController.signUp));

router.post(
  "/login",
  alreadyLoginCheck,
  passport.authenticate("local", {
    failureRedirect: "loginFailure",
  }),
  userController.login
);

router.get("/logout", userController.logout);

router.get("/loginFailure", userController.failureLogin);

router.get("/cart", checkLogin, wrapAsync(userController.getCartDetails));

router.get("/order/:id", checkLogin, wrapAsync(userController.getOrderDetails));

router.get(
  "/placedOrders",
  checkLogin,
  wrapAsync(userController.getOrdersPlacedDetails)
);

router.get(
  "/receivedOrders",
  checkLogin,
  wrapAsync(userController.getOrdersReceivedDetails)
);

router.get(
  "/notifications",
  checkLogin,
  wrapAsync(userController.getNotifications)
);

router.get("/products", checkLogin, wrapAsync(userController.userProducts));

router.get("/checkLogin", checkLogin, userController.loggedIn);

export default router;
