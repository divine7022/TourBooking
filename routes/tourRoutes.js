const express = require('express');

const tourController = require('../controller/tourController');

const router = express.Router(); // just like this we create a new Router and save it into a "tourRouter" variable.

// PARAM MIDDLEWARE FUNCTION:
router.param('id', tourController.checkID);

// Create a checkBody middleware
//Check if body conatins the name and price property
// If not, send back 400(which stands for bad / invalid request from the client without name and price property)
// Add it to the post handler stack

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour); // This is how we chain the multiple middleware.
// if the tourController.checkBody doesn't hit the "if" condition then it call the next() function i,e "tourController.createTour" which is in the middleware stack
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router; // Used to export a single function, object, or variable from a module.

////---COMMENTS----
/// router.param('id') -->
//parameter:  here we specify first the parameter(i,e we want to search for the id) that we want to search for[basically the parameter for which this middleware is gona run and it is called "id" and then the actual middleware function(where we have access to the actuall "req" and "res" object and since it is a middleware function it also has a access to the nexta() function ) and in the "PARAMS MIDDLEWARE function " we also have an access to the 4th argument i,e *val(value)* (that is the value of the parameter which is in the question ) ]. (i,e we want to search for the id)

//router.param('id', (req, res, next, val) => {
//this fucn will not work for userRouters cuz it is defined here
//  console.log(`Tour id is: ${val}`); // "val" holds the value of the "id" parameter
//  next(); // we also want to call next() cuz otherwise the request response cycle will get stuck in this middleware function will not be able to move on to the next middleware in the stack(which are next line👇)
//});
