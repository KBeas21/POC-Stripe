import React, { Component } from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import { getUnconfirmedSetupIntent, getSetupIntents } from './serviceCalls/setupIntentCalls'


class StripeCard extends Component {
  /**
   * 
   * @param {JSevent} event - 
   * @returns 
   */
  handleSubmit = async (event) => {
    event.preventDefault();
    const { stripe, elements } = this.props;

    if (elements == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        name: "Kevin's Test",
        email: "KevinsEmail@emailTest.com",
        address: {
          line1: "5440 W 110th",
          line2: "Suite #200",
          city: "Overland Park",
          state: "Kansas",
          postal_code: "66211",
          country: "US",
        }
      }
    });

    if (error) {
      console.log('[error] with paymentMethod', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
    }
    // START Call for unconfirmed SetupIntent
    const memberUid = "mb2468";
    const options = {
      method: 'POST',
      headers: {
        'Origin': 'http://localhost:3000',
      },
    };

    // getUnconfirmedSetupIntent is hitting the BE express server
    const unconfirmedSetupIntent = await getUnconfirmedSetupIntent({ memberUid, options })

    // END Call for unconfirmed SetupIntent
    // START call to confirmCardSetup
    const confirmCardSetupData = {
      // TODO: create the paymentMethod here over before...maybe https://stripe.com/docs/api/payment_methods/create (current way is Stripe's recommended way)
      payment_method: paymentMethod.id,
    }
    /*
      Stripe.confirmCardSetup(clientSecret: string, data?: ConfirmCardSetupData, options?: ConfirmCardSetupOptions): Promise<SetupIntentResult>
    */
    const confirmCardSetup = await stripe.confirmCardSetup(unconfirmedSetupIntent.setupIntentKey, confirmCardSetupData)

    if (confirmCardSetup.error) {
      console.log('[error] with confirmCardSetup', error);
    } else {
      console.log('[confirmCardSetup]', confirmCardSetup);
    }
    // END call to confirmCardSetup
  }

  /**
   * 
   * @param {JSevent} event 
   */
  handleGetSetupIntents = async (event) => {
    event.preventDefault();
    const stripeCustomerId = document.getElementById('getSetupIntents-test').value;
    const options = {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:3000',
      },
    };

    const setupIntents = await getSetupIntents({ stripeCustomerId, options });

    console.log("[setupIntents]\n", setupIntents)

    this.setState({ receivedSetupIntents: setupIntents });
  }

  render() {
    const { stripe } = this.props;

    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
          <button type="submit" disabled={!stripe}>
            Confirm
          </button>
        </form>
        <br />
        <div style={{
          /* Other styling... */
          "textAlign": "right",
          clear: "both",
          float: "left",
          "marginRight": "15px"
        }}>
          <label>Get SetupIntents</label>
          <span>
            <input name="test" id="getSetupIntents-test"
              type="text" placeholder="Stripes customer ID" />
          </span>
        </div>
        <br />
        <button onClick={this.handleGetSetupIntents} disabled={!stripe}>
          Get SetupIntents
        </button>
      </>
    )
  }
}


export default StripeCard;
