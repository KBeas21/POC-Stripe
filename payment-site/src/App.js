import "./App.css";
import { Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCard from "./stripeComponents/StripeCard";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51JTrXPKDcwwl1Oe4ruMMSSeMbkN4UpcWTTX63KSESmrXJZtYEehiHgGVumzCUFloG5csmIwxe2ZrHOj4XqVXezDj00JPjSoMPw"
);

const InjectedStripeCardForm = () => (
  <ElementsConsumer>
    {({ stripe, elements }) => (
      <StripeCard stripe={stripe} elements={elements} />
    )}
  </ElementsConsumer>
);

function App() {
  return (
    <div className="App">
      <Elements stripe={stripePromise}>
        <InjectedStripeCardForm />
      </Elements>
    </div>
  );
}

export default App;
