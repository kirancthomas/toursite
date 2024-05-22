const express = require('express');
const viewController = require('../controller/viewController');
authController = require('../controller/authController');



const router = express.Router();

  
router.get('/', authController.isLoggedIn, viewController.overView);
router.get('/tour/:slug',/*authController.protect,*/ authController.isLoggedIn, viewController.getTour );
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me',authController.protect, viewController.getAccount);


router.post('/submit-user-data',authController.protect, viewController.updateUserData);
module.exports = router;