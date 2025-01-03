import { config as dotEnvConfig } from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotEnvConfig();
}

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import User from "./models/User.js";
import userRouter from "./routes/user.js";
import listingRouter from "./routes/listing.js";
import LocalStorage from "passport-local";
import mongoose from "mongoose";

const app = express();

const DB_URL = process.env.DB_PORT || "mongodb://127.0.0.1:27017/emandi";

main()
  .then(() => {
    console.log("DB connected", DB_URL);
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(DB_URL);
}

const store = MongoStore.create({
  mongoUrl: DB_URL,
  crypto: {
    secret: process.env.SECRET || "My secret code",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error occured in mongo session store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET || "MySecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

app.use(bodyParser.json());
app.use(session(sessionOptions));

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

//passport configurations
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStorage(User.authenticate()));
passport.serializeUser(User.serializeUser()); // To save the user in the browser
passport.deserializeUser(User.deserializeUser()); // To unsave the user in the browser

app.use("/api/listing", listingRouter);
app.use("/api/user", userRouter);

app.use((err, req, res, next) => {
  if (err) {
    const { status = 500, msg = "server error" } = err;
    console.log("error middleware");
    console.log(err);
    console.log(`${status} , ${msg}`);
    res.status(status).send(msg);
  } else {
    next();
  }
});

const port = 8080;

app.listen(port, () => {
  console.log(`App is listening pn port ${port}`);
});
