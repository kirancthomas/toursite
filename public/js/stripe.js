import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_BUkd0ZXAj6m0q0jMyRgBxNns00PPtgvjjr');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:4000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
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