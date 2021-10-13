/**
 * Routes for the customerRouter, since we are using express see https://expressjs.com/en/guide/routing.html
 * for more information about how to build these strings
 */
const CUSTOMER_ROUTES = {
  CREATE_CUSTOMER: "/v1/payment-service/stripe/create-customer/:memberId",
  GET_CUSTOMER: "/v1/payment-service/stripe/get-customer/:memberId",
  UPDATE_CUSTOMER:
    "/v1/payment-service/stripe/update-customer/:stripeCustomerId",
};

Object.freeze(CUSTOMER_ROUTES);

module.exports = CUSTOMER_ROUTES;
