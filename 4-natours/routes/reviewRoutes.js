const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST /tour/6538e611e1d95fba218bab6cs/reviews  ===> Nested Routes
// POST /reviews

router
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
