const fs = require('fs'); // this is a core moduel(should be always at the beginnig)
const express = require('express');
const morgan = require('morgan'); //Morgan is a middleware in Express.js used for logging HTTP requests.+

const app = express();

// 1) MIDDLEWARES
// inside use() method we need to add the function that will be add to the middleware stack.
// app.use(morgan('tiny')); // it gives the same log as "dev" but the formate of log is bit different.
app.use(morgan('dev'));

app.use(express.json()); // here express.json is middleware

app.use((req, res, next) => {
  console.log('Hello from the middleware👋');
  next(); // sending the req and res to the next middleware by calling next() function.
});

// This time we are manipulating the request object.
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // to see when exactly the request happened.
  next(); // should not forget the call the next() middleware from the middleware stack.
});

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endport...');
// });

//Now it will be in the top level code.(will execute only once at the beginning. cuz get rid of call back heel if i write inside the app.get())

const tours = JSON.parse(
  // now the string object will be converted to the js object.
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

///2) ROUTE HANDLERS
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  // this is response.
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      // tours: tours,
      tours,
    },
  });
};

// it is to get only one tour
const getTour = (req, res) => {
  // console.log(req.params);

  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);
  // if(id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1; // here the newId will be older data last id + 1.
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours), // it converts the js object into the string manner how it was initially
    (err) => {
      // now we will send the newly created object as a response.
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1; // here the newId will be older data last id + 1.
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours), // it converts the js object into the string manner how it was initially
    (err) => {
      // now we will send the newly created object as a response.
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    // (*1) is to conver it to the number
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    // 500 is interenal serever error.
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    // 500 is interenal serever error.
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// app.route('/api/v1/tours').get(getAllTours)  //  both are exactly the same.
// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTour);

// app.post('/api/v1/tours', createTour); // means if we want to create new resource on a server

// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);

// The Routes here are themself a middlewares. but only apply certain URL/Route.
// here we specify the route that we want. and on there specify what we want on "get"

/// 3) ROUTES
app.route('/api/v1/tours').get(getAllTours).post(createTour); // when we are calling get or post without the "id" in the url('/api/v1/tours'),it means that either want to get all the users and if we use "post" we need to create a new user/new resource on a server.
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/app/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

/// 4) START SERVER:
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

/////// ---COMMENTS---///

///app.get('/api/v1/tours', (req, res) => {}
//* the purpose of writing v1 is : if we want to make any changes then we can make it by creating the v2 .cuz we should not effect to any users of the v1 by our changes or updates.So we always should specify the version of the api.
// this callback((req, res) => {}) is called the Route handler.
//* this callback((req, res) => {}) is called the Route handler.
//* when the user search this url then we need to send all of the data.
//* here "tours" is a resources now in the above url.
//** in each middleware function it has access to "request" and "response" object and also "next()".
// And this middleware apply to each and every "request" that we make in the Browser. That is because we didn't        specified any Route here.

/// __dirname : is the folder where the current script is available(i,e the main folder).

///const tours = JSON.parse(  --> So that the json that we have here automatically be converted to an array of javaScript object.

///data: {
//    tours: tours, // this is read by the tours-simple.json file
//    tours, // just tours cuz both key and value pair have the same name
//   },

///app.use(express.json()); // here express.json is middleware
// middleware : the middleware basically just a function that modify the incomming request data.
// express.json , is called as middleware cuz it stands between in the middle of the "request" and the "resoponce"
// console.log(req.body) -> req.body (body is the property that is gonna be available on the request, cuz we use that middleware a couple of minutes ago )
///  console.log(req.body);
// the req object holds all the data/info about the request that was done. if that request contains some data that was sent then that data should be on the request.

// which allows us to create a new object by merging together with an existing object

///app.route('/api/v1/tours').get(getAllTours).post(createTour); -->
//👆this is also an "middleware" but only apply for a certain URL/Route.

///app.use((req, res, next) => {
//  console.log('Hello from the middleware👋');
//  next(); });
//👆 : this is apply for the all the Request . cuz we didn't specified any Route here. if it before any Route handler. If it come after Route then it will be called after the execution of the Previous Route by the help of next() function.

///new Date().toISOString --> (.toISOstring)  it will then convert the date into nice readable formate.

///--->app.route('/api/v1/tours').get(getAllTours).post(createTour);

// just if we call/request for the above router then we only get that responce not this middleware is executed.cuz the middleware stack will be terminate/end. So if we call the getTour by id(means a perticular )
// app.use((req, res, next) => {
//   console.log('Hello from the middleware👋');
//   next(); // sending the req and res to the next middleware by calling next() function.
// });

///app.use(morgan('dev')) // for this function we can pass arguments , which will kind of specify how we want the "login" to look like, and we can use some predefined strings for that and we are goning to use called "dev"

///app.use(morgan('dev')); // for this function we can pass arguments , which will kind of specify how we want the "login" to to like, and we can use some predefined strings for that and we are goning to use called "dev"

///res.status(500); The 500 error typically indicates an internal server error, meaning something is wrong with your server logic.
