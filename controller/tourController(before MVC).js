const fs = require('fs'); // this is a core moduel(should be always at the beginnig)

const tours = JSON.parse(
  // now the string object will be converted to the js object.
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
  }
  next(); //means if the "if" condition dosn't hit and everything is correct then it call the next()[move to the next middleware]. and the next middleware will be "createTour"
};

//creating Param middleware to check if the requested id is valid or not
// we are not using checkid funcn in the tourController.js file cuz we are DB it gives the id, if the id is wrong then the mongo db will itself gives the error.
exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (req.params.id * 1 > tours.length) {
    // (*1) is to conver it to the number
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  // if the "if" condition is true then it doesn't go to the next()[next() calls the next middleware] it returns(it will finish, doesn't go to next()). if the "if" contion is false then it go to the next().
  next(); //after returning this response then it will move on to the next middleware and then another response to the client.
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  // this is response.
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      // tours: tours,
      tours
    }
  });
};

// it is to get only one tour
exports.getTour = (req, res) => {
  // console.log(req.params);

  const id = req.params.id * 1;

  const tour = tours.find(el => el.id === id);
  // if(id > tours.length) {
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1; // here the newId will be older data last id + 1.
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours), // it converts the js object into the string manner how it was initially
    err => {
      // now we will send the newly created object as a response.
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Upadated tour here...>'
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
