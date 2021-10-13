const SETUPINTENTS_ROUTES = {
  CREATE_SETUPINTENT: "/v1/payment-service/stripe/setupintent-member/:memberId",
  GET_SETUPINTENTS:
    "/v1/payment-service/stripe/setupintent-member/:stripeCustomerId", // would normally be memberId but don't have a mock DB setup yet
};

Object.freeze(SETUPINTENTS_ROUTES);

module.exports = SETUPINTENTS_ROUTES;
