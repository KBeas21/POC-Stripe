/**
 * @private
 * Used to create a setuoIntent on the backend to be edited via Stripes components
 *
 * @param {Object} getUnconfirmedSetupIntentObject - hold all the information needed for to get a UnconfirmedSetupIntentObject
 * @param {String} getUnconfirmedSetupIntentObject.memberUid - members Unique identifier
 * @param {Object} getUnconfirmedSetupIntentObject.options - fetches data option @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 *
 * @returns {Promise<Object>} Stripes customer id and SetupIntents client secret
 */
async function getUnconfirmedSetupIntent({ memberUid, options }) {
  const unconfirmedSetupIntent = await fetch(
    `http://localhost:3001/v1/payment-service/stripe/setupintent-member/${memberUid}`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(
        "This unconfirmedSetupIntent call has SetupIntent Client secret and customerId\n",
        data
      );
      return data;
    });
  return unconfirmedSetupIntent;
}

async function getSetupIntents({ stripeCustomerId, options }) {
  const setupIntents = await fetch(
    `http://localhost:3001/v1/payment-service/stripe/setupintent-member/${stripeCustomerId}`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("This is a customers SetupIntents\n", data);
      return data;
    });
  return setupIntents;
}

export { getUnconfirmedSetupIntent, getSetupIntents };
