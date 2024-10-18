const express = require('express');

const tourController = require('../controller/tourController');

const router = express.Router(); // just like this we create a new Router and save it into a "tourRouter" variable.

// why we are writing "/" insterd of '/api/v1/tours' is cuz we are already at this Route. It basically mean that this("/") is the route of this("/api/v1/tours") url.
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour); // when we are calling get or post without the "id"
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router; // Used to export a single function, object, or variable from a module.
