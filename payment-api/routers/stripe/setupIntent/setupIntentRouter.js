require("dotenv").config();
const express = require("express");
const router = new express.Router();
const SETUPINTENTS_ROUTES = require("./setupIntentRoutes");
const stripe = require("stripe")(process.env.SECRET_KEY);

/**
 * used to prevent COR errors
 */
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

/**
 * Used when a member creates a new or edits a card....is the thought
 */
router.post(SETUPINTENTS_ROUTES.CREATE_SETUPINTENT, (req, res) => {
  const memberId = req.params.memberId;

  // need to test if this is needed express might match closest route
  if (!memberId) {
    // regex would look like, "/mb\d*/g"
    res.status(400).send();
  }

  try {
    if (memberDoesNotExists(memberId) && memberUidIsReal(memberId)) {
      // TODO: validate member is an actual member in member service
      // create stripe user here
      stripe.customers.create().then((customer) => {
        // TODO: write valid member and customer.id to payment service DB we can do
        // this in an event if we want to save time and just return the id here -- just an idea
        let stripeCustomerId = customer.id;
        stripe.setupIntents
          .create({
            customer: stripeCustomerId,
            payment_method_types: ["card"],
          })
          .then((setupIntent) => {
            const clientSecret = setupIntent.client_secret;

            console.log("The is the unconfirmed setupIntent\n", setupIntent);

            res.status(200).send({
              customerId: stripeCustomerId,
              setupIntentKey: clientSecret,
            });
          });
      });
    } else {
      // this might need to be a different error code because member might not be valid also
      res.status(404).send("Member Not Found");
    }
  } catch (error) {
    console.log("The SetupIntent can't be created at this time\n", error);
    res.status(500).send();
  }
});

/**
 * 
 */
router.get(SETUPINTENTS_ROUTES.GET_SETUPINTENTS, (req, res) => {
  const customerId = req.params.stripeCustomerId;
  console.log("req.params\n\n", req.params, "\n\n");
  // TODO: create this method so that we can receive a list of setupIntents that we can interface with out the FE.
  stripe.setupIntents
    .list({
      expand: ['data.payment_method'],
      customer: customerId,
    })
    .then((setupIntents) => {
      res.status(200).send({
        setupIntents,
      });
    })
    .catch((error) => {
      console.log(error);

      res.send(Error("Can not process payment\n\n", error));
    });
});

/**
 * @private
 * Looks up members in payment service's DB to verify if a member
 * already exists.
 * Note - in the future this call would be async
 *
 * @param {String} memberId - the memberId to check
 *
 * @returns {Boolean} true if member is already in our DB
 */
function memberDoesNotExists(memberId) {
  return true;
}

/**
 * @private
 * This is used to validate a given memberId is an actual member. Look up in other DB
 * Note - in the future this call would be async
 *
 * @param {String} memberId - the memberId to validate
 *
 * @returns {Boolean} true if the member is valid
 */
function memberUidIsReal(memberId) {
  return true;
}

module.exports = router;
