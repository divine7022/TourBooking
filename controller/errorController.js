// This is a Gloabal error handler function. when ever error occured in request it will use this function.

const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  // err.path has path (i,e serched "id") and err.value has the value of that id.
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400); // 400 -> bad request
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
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    sendErrorProd(error, res);
  }
};

//
//Opertional Error: means the error created by ourself using "appError.js" when we get the error while get, post, patch, delete request.

// "CastError" :this is the error given by mongooes when we enter a worng id(to get a perticular tour).

// handleCastErrorDB(error) -->  to this function we will send a error(err) created by mongooes . then it will return a "new error" created by our "appError" class , in that all the error has property "isOperational" set to "true"
