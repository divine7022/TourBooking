const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

// here we are wrapingup in a "catchAsync" so that we no need to write a try and catach block.
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: {
      user: newUser
    }
  });
});
