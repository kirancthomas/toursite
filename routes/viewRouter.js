const express = require('express');
const viewController = require('../controller/viewController');
const authController = require('../controller/authController');
const bookingController = require('../controller/bookingController');


const router = express.Router();

router.use(viewController.alerts);
  
router.get('/', authController.isLoggedIn, viewController.overView);
router.get('/tour/:slug',/*authController.protect,*/ authController.isLoggedIn, viewController.getTour );
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);
router.get('/me',authController.protect, viewController.getAccount);

router.get('/my-tours'/*,bookingController.createBookingCheckout*/,authController.protect, viewController.getMyTours);
router.get('/my-reviews', authController.isLoggedIn, viewController.getMyReviews);



router.post('/submit-user-data',authController.protect, viewController.updateUserData);
module.exports = router;