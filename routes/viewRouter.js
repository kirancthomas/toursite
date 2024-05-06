const express = require('express');
const viewController = require('../controller/viewController');


const router = express.Router();
  
router.get('/',viewController.overView);
router.get('/tour', viewController.tour);
router.get('/tour/:slug',viewController.getTour );
module.exports = router;