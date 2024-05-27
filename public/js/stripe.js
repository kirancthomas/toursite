import axios from 'axios';
import { showAlert } from './alerts';
import { loadStripe } from '@stripe/stripe-js';

// Use live mode publishable key
const stripePromise = loadStripe('pk_test_51PIyVySJOUhjYPMzTjWhgZkOo8tccsgfXw5TYLzyXG5w6Qb65fRRBENt8ocKAqQSDdb5By7cEwuB5GWS4grHbvKP00jL65frxk');

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API (ensure this is a live mode session)
    const session = await axios.get(`/api/v1/bookings/checkout-session/${tourId}`);
    

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







