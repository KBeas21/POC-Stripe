require("dotenv").config();
const express = require("express");
const router = new express.Router();
const stripe = require("stripe")(process.env.SECRET_KEY);

/**
 * used to prevent COR errors
 */
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

/**
 * Creates a customer and then bills that customer immediately
 *
 * NOTE: This doesn't work for setting up a card for future payments @see setupIntentRoutes for that
 */
router.post("/payment", (req, res) => {
  // eslint-disable-next-line
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: req.body.name,
      address: {
        line1: "5440 W 110th",
        line2: "Suite #200",
        city: "Overland Park",
        state: "Kansas",
        postal_code: "66211",
        country: "US", // https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
      },
    })
    .then((customer) => {
      console.log("This is the customer", customer);

      return stripe.charges.create({
        amount: 7000,
        description: "Bob Ross painting",
        currency: "USD",
        customer: customer.id,
      });
    })
    .then((charge) => {
      console.log("This is the charge", charge);

      res.send("Success");
    })
    .catch((error) => {
      console.log(error);

      res.send(Error("Can not process payment\n\n", error));
    });
});

// router.post("/payment-processor/stripe/setup-intents", (req, res) => {
//   stripe.customers
//     .create({
//       email: req.body.stripeEmail,
//       source: req.body.stripeToken,
//       name: req.body.name,
//       address: {
//         line1: "5440 W 110th",
//         line2: "Suite #200",
//         city: "Overland Park",
//         state: "Kansas",
//         postal_code: "66211",
//         country: "US", // https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
//       },
//     })
//     .then((customer) => {
//       console.log("This is the customer", customer);
//       console.log("\n\n\n", 123456789012345678901234567890, "\n\n\n");

//       return stripe.setupIntents.create({
//         payment_method_types: ["card"],
//       });
//     })
//     .then((setupIntent) => {
//       console.log("This is the setupIntent", setupIntent);

//       res.send("success").send(setupIntent);
//     })
//     .catch((error) => {
//       console.log(error);

//       res.send(Error("Can not process payment\n\n", error));
//     });
// });

module.exports = router;
