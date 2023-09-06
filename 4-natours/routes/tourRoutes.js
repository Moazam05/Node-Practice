// 3rd Party modules
const express = require('express');
// Custom Imports
const tourController = require('../controllers/tourController');

const { getAllTours, createTour, getTour, updateTour, deleteTour, checkID } =
  tourController;

const router = express.Router();

router.param('id', checkID);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
