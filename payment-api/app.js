require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const customerRouter = require("./routers/stripe/customer/customerRouter");
const paymentRouter = require("./routers/stripe/payment/paymentRouter");
const setupIntentRouter = require("./routers/stripe/setupIntent/setupIntentRouter");

const app = express();
app.set("view engine", "ejs");

/**
 * Default view
 * TODO: since this is only used for testing we need to remove this later
 */
app.get("/", (req, res) => {
  res.render("Home", {
    key: process.env.PUBLISHABLE_KEY,
  });
});

// app.get("setupIntent", (req, res) => {
//   console.log("req.body", req.body);
//   res.render("SetupIntentTest", {
//     key: process.env.PUBLISHABLE_KEY,
//   });
// });

// app.get("setupIntentConfirmed", (req, res) => {
//   res.render("SetupIntentTestConfirmed", {
//     key: process.env.PUBLISHABLE_KEY,
//     data: req.data,
//   });
// });

/**
 * 3rd party libs
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * our routes
 */
app.use(customerRouter);
app.use(paymentRouter);
app.use(setupIntentRouter);

module.exports = app;
