// This is a Gloabal error handler function. when ever error occured in request it will use this function.
// The express search this function when ever error occured in the request. express search for the fuction which contains 4 parametest.
//TO SEE THE ALL PROPETIES OF ERROR START IN "DEVELOPMENT" ENVIRONMENT.

const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  // err.path has path (i,e serched "id") and err.value has the value of that id.
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400); // 400 -> bad request
};

//This is the error handling when we try to send the Duplicate data(means existing data)
const handleDuplicateFieldDB = err => {
  // console.log(err); to check the message property when we get an error.
  const value = err.message.match(/"([^"]+)"/)[0];
  const message = `Duplicate field value: ${value}, please use another value!`;
  return new AppError(message, 400);
};

const handleValidtaionErrorDB = err => {
  // we will get the array validation(i,e name, difficulty, ratingsAverage) errors(many). So we want to loop through that array(we use "map" to iterate)
  const errors = Object.values(err.errors).map(el => el.message); // now the messages will copied to "errors" variable.
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  //OPERATIONAL, TRUSTED ERROR: SEND MESSAGE TO CLIENT
  //means the error created by ourself using "appError.js" when we get the error while get, post, patch, delete request.
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  //PROGRAMMING OR OHTER UNKNOWN ERROR: DON'T LEAK ERROR DETAILS
  //if the error is not created by ourself(that means error is not by the get, post,etc.. methods). when we get the error by the Third party liberaries, then we send a Generic type of message.
  else {
    // 1) Log error
    console.log('ERROR 💥', err);

    //2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500; // internal server error
  err.status = err.status || 'error'; // if no status by default it set message to "error"

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
  // we want to display less info about error in the "production" environment.
  else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }; // here we are creating a "copy" of the original error. cuz to not tamper the original err
    error.message = err.message;
    error.name = err.name;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error); // the code(11000) that comes when the duplicate name we try to "post" again.
    if (error.name === 'ValidationError')
      error = handleValidtaionErrorDB(error);
    sendErrorProd(error, res);
  }
};

//
//Opertional Error: means the error created by ourself using "appError.js" when we get the error while get, post, patch, delete request.

//TO SEE THE ALL PROPETIES OF ERROR START IN "DEVELOPMENT" ENVIRONMENT.

// "CastError" :this is the error given by mongooes when we enter a worng id(to get a perticular tour).

// handleCastErrorDB(error) -->  to this function we will send a error(err) created by mongooes . then it will return a "new error" created by our "appError" class , in that all the error has property "isOperational" set to "true"

//const value = err.message.match(/"([^"]+)"/)[0]; // this "message" is the property we get when we send the duplicate data. 👆requlare expression for Grabbing values between quotation marks. [0] cuz i need only first expression in that regular expresson array.

///const error = Object.values(err.errors).map()
//    we will get the array validation(i,e name, difficulty, ratingsAverage) errors(many). So we want to loop through that array(we use "map" to iterate).
//    Object.values is name, difficulty, ratingsAverage
