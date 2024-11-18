//This is mainly used to create error object.
//means the error created by ourself using "appError.js" when we get the error while get, post, patch, delete request.
// class AppError(we are creating) want to inherit all the built-in Error(built-in) class
// we use this function to Create error.
class AppError extends Error {
  // constructor is called when we create a new object.
  constructor(message, statusCode) {
    super(message); // message is the only parameter that the built-in Error class excepts.
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; //all the error created by ourself using this class "AppError" we are setting a property isOperational = true.

    // "this" refers the current object
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

///
// this.isOperational = true; // all of the error gets isOperational property set to "true" and later we can test for this👆 propery and only send error messages back to the Client for these Operational error that we created using this class(AppError).
//Error.captureStackTrace(this, this.constructor); --> :
//By specifying "this.constructor" :
// *Exclude the current constructor function (AppError) from the stack trace, making it cleaner and more useful for debugging.
// *Ensure that the error stack trace starts from the point where the error originated, not where the custom error class was instantiated.
