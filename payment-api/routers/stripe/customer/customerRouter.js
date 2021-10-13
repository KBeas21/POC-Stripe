require("dotenv").config();
const express = require("express");
const router = new express.Router();
const CUSTOMER_ROUTES = require("./customerRoutes");
const stripe = require("stripe")(process.env.SECRET_KEY);

/**
 * used to prevent COR errors
 */
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

/**
 * @see https://stripe.com/docs/api/customers/create
 * @see https://stackoverflow.com/questions/4024271/rest-api-best-practices-where-to-put-parameters
 *
 */
router.post(CUSTOMER_ROUTES.CREATE_CUSTOMER, (req, res) => {
  const memberId = req.params.memberId;
  let customer;

  // need to test if this is needed express might match closest route
  if (!memberId) {
    // regex would look like, "/mb\d*/g"
    res.status(400).send();
  }
  // TODO: look up member in our DB to prevent duplicate creation
  if (doesMemberAlreadyExists(memberId)) {
    res.status(409).send("member already exists");
  }

  if (isRealMember(memberId)) {
    // TODO: validate member is an actual member in member service
    try {
      // create stripe user here
      customer = stripe.customers.create({
        email: req.body.stripeEmail, // OPT String field
        description: req.body.description, // OPT String field
        name: req.body.name, // OPT String field
        address: {
          line1: "5440 W 110th",
          line2: "Suite #200",
          city: "Overland Park",
          state: "Kansas",
          postal_code: "66211",
          country: "US", // https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
        },
        metadata: {
          memberId,
        },
      });

      // TODO: write valid member and customer.id to payment service DB we can do
      // this in an event if we want to save time and just return the id here -- just an idea

      res.status(200).send(customer.id);
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  } else {
    res.status(404).send("Member Not Found");
  }
});

/**
 * @see https://stripe.com/docs/api/customers/retrieve
 */
router.get(CUSTOMER_ROUTES.GET_CUSTOMER, (req, res) => {
  let customer, stripeCustomer;
  // memberId of logged in member to portal
  const memberId = req.params.memberId;
  // OPT - if provided look this member up. Needed for guardian relationships
  const memberIdToLookUp = req.body.memberId;

  if (!memberId) {
    res.status(400).send();
  }

  // look up stripe customerId via the memberId here in our DB
  // if it is not there error out...
  //   "saying member not found...maybe create them first"
  // and then call...retrieveCustomer here
  try {
    //if we take in stripeId over customerId we can
    stripeCustomer = stripe.customers.retrieve();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

/**
 * @see https://stripe.com/docs/api/customers/update
 */
router.post(CUSTOMER_ROUTES.UPDATE_CUSTOMER, (req, res) => {});

/**
 * @private
 * This is used to validate a given memberId is an actual member
 *
 * @param {String} memberId - the memberId to validate
 *
 * @returns {Boolean} true if the member is valid
 */
async function isRealMember(memberId) {
  return true;
}

/**
 * @private
 * Looks up members in payment service's DB to verify if a member
 * already exists.
 *
 * @param {String} memberId - the memberId to check
 *
 * @returns {Boolean} true if member is already in our DB
 */
async function doesMemberAlreadyExists(memberId) {
  return false;
}

module.exports = router;
