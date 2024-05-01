const express = require('express');
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');

const router = express.Router({ mergeParams: true });

//post /tour/sfg74/reviews
//post /reviews

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserId,
    reviewController.createReview,
  );

router.route('/:id').get(reviewController.getReview).patch(reviewController.updateReview).delete(reviewController.deleteReview);



module.exports = router;
