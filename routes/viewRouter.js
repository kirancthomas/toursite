const express = require('express');
const viewController = require('../controller/viewController');
authController = require('../controller/authController');



const router = express.Router();

router.use(authController.isLoggedIn);
  
router.get('/',viewController.overView);
router.get('/tour/:slug', viewController.getTour );
router.get('/login',viewController.getLoginForm);
module.exports = router;