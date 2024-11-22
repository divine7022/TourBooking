const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find(); // it givs all the users

  // SEND RESPONSE
  res.status(200).json({
    status: 'Success',
    results: users.length,
    data: {
      users // now the password field won't be visiable cuz set it to false
    }
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    // 500 is interenal serever error.
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
