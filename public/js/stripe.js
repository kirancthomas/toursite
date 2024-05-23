import axios from 'axios';
import { showAlert } from './alerts';
import { loadStripe } from '@stripe/stripe-js';

// Use live mode publishable key
const stripePromise = loadStripe('pk_test_51PIyVySJOUhjYPMzTjWhgZkOo8tccsgfXw5TYLzyXG5w6Qb65fRRBENt8ocKAqQSDdb5By7cEwuB5GWS4grHbvKP00jL65frxk');

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API (ensure this is a live mode session)
    const session = await axios.get(`http://127.0.0.1:4000/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Load Stripe.js and redirect to checkout
    const stripe = await stripePromise;

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err.message);
  }
};














// import axios from 'axios';
// import { showAlert } from './alerts';
// import { loadStripe } from '@stripe/stripe-js';
 
// export const bookTour = async tourId => {
//   const stripe = await loadStripe(
//     'pk_live_51PIyVySJOUhjYPMztRs1qHTpV2GZxfqnbCbL9cpUNbH7jaCkEs1A9zUoVY2xkPRmBXqIxmqahb1UOLLWXQxxaYcQ00hh3NIiD4'
//   );
 
//   try {
//     // 1) Get Checkout session
//     const response = await axios.get(
//       `http://127.0.0.1:4000/api/v1/bookings/checkout-session/:${tourId}`
//     );
//     const session = response.data.session;
 
//     // 2) Redirect to checkout form
//     await stripe.redirectToCheckout({
//       sessionId: session.id
//     });
//   } catch (err) {
//     console.log(err);
//     showAlert('error');
//   }
// };