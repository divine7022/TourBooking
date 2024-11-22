// The app.js we have here is mainly used for "middleware" declerations. That we have all the middleware that we want to apply to all the routes, so in this case these 4 middleware(morgan, express.json, (req, res, next))
const express = require('express');
const morgan = require('morgan'); //Morgan is a middleware in Express.js used for logging HTTP requests.

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// 1) MIDDLEWARES
// we only log in the terminal if the NODE ENVIRONMENT is in "development". we should not log if we are in the "Production"
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json()); // here express.json is middleware

// SERVING STATIC FILE
app.use(express.static(`${__dirname}/public`)); // argument we need to specify the directory from which we want to server static file.
// Then we will be able to open the html files and images in the public directiory.

//
// app.use((req, res, next) => {
//   console.log('Hello from the middleware👋');
//   next(); // sending the req and res to the next middleware by calling next() function.
// });

// MIDDLEWARE
// This time we are manipulating the request object.
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // to see when exactly the request happened.
  next(); // should not forget the call the next() middleware from the middleware stack.
});

/// 3) ROUTES:
// we imported routes at the top and then "mounting" the router on two different routes that we have currently implemented.
//# means for this route "/api/v1/tours" we want to apply "tourRouter" *MIDDLEWARE* . for that we can use * app.use * to mount them.
app.use('/api/v1/tours', tourRouter); // Any requests that start with /api/v1/tours should be handled by tourRouter.
app.use('/api/v1/users', userRouter); //# means for this route "/api/v1/user" we want to apply "userRouter" *MIDDLEWARE* . for that we can use * app.use * to mount them.

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

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

///app.use(morgan('dev')) // for this function we can pass arguments , which will kind of specify how we want the "login" to to like, and we can use some predefined strings for that and we are goning to use called "dev"

///app.use(morgan('dev')); // for this function we can pass arguments , which will kind of specify how we want the "login" to to like, and we can use some predefined strings for that and we are goning to use called "dev"

///res.status(500); The 500 error typically indicates an internal server error, meaning something is wrong with your server logic.

/// app.use(express.static('')) // in argument we need to specify the directory from which we want to server static file(like images and html files )
