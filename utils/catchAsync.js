// we are creating this function in order to get rid of "try" and "catch" block in the "createTour" function
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // if it has an error it is called to the next()(i,e it then call the Global error handling function(appError.js))
  };
};
