const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
  // { id: id } --> {id(this the id field created) : id(this is the id passed as an argument)}
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// here we are wrapingup in a "catchAsync" so that we no need to write a try and catach block.
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    // If we didn't check then anyone can login as "Admin".If we want to add the Admin then we need to add in the Mongoess compause.
    // So here we are only allowing the data we need to be put into the "newUser".
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  //jwt.sign(payload, secretOrPrivateKey, [options, callback]) // we are using "jwt.sign" to CREATE the "New Token"
  // the "newUser" is created at above.
  const token = signToken(newUser._id);
  // 201 -> created
  res.status(201).json({
    status: 'Success',
    token, // we are sending the token to client
    data: {
      user: newUser
    }
  });
});

//loging user in based on the password and email address(basically means to sign a "json web token" and send it back to the client,but in this case the only issue to the token in case that the user actually exist and the password is correct)
// This is only valid for "Post" request(cuz we want to send the login creditional to the body)
exports.login = catchAsync(async (req, res, next) => {
  // this is how user gonna send in the login "credentials"for us to check. And that "check process" has a couple of STEPS.
  const { email, password } = req.body;

  //1) CHECK IF EMAIL AND PASSWORD EXIST
  if (!email || !password) {
    //then we want to send a error message to our client(we are doing it by "AppError". we will simply create a new error and our Global error handling middelware sends that error back to the client)
    return next(new AppError('Please provide email and password!', 400)); //-> 400 "bad request"
  }

  //2) CHECK IF THE USER "EXIST"(for that "posted" request) AND AT THE SAME TIME "CHECK IF THE PASSWORD IS CORRECT"
  const user = await User.findOne({ email: email }).select('+password'); //The query fetches a user document based on the email provided and "explicitly" includes the password field in the result(but here it doesn't check the password just will select. The selection of user from the doucment is only based on email and considering password to check).
  //Include password temporarilybin the query to check if the provided password matches the stored one.

  // const correct = await user.correctPassword(password, user.password); // "password" came from the request(in normal form) and "user.password" is from the document(in Encrypted form). The "correctPassword" function returns "true" or "false".

  if (!user || !(await user.correctPassword(password, user.password))) {
    // if the user exist("posted" email matches the document) then it Compares the "password"
    return next(new AppError('Incorrect email or password', 401));
  }
  // If the password matches (the password "posted" and in document) the we need to send a Token(by creting)

  //3) IF EVERYTHING OK, SEND TOKEN TO CLIENT
  const token = signToken(user._id);
  res.status(200).json({
    status: 'Success',
    token
  });
});

// middleware function to check if the user is logied in or not , before displaying all Tours(Access)
// basically if the provided Json web token is correct then we give "ACCESS" to Protected route(i,e like getAllTours..)
exports.protect = catchAsync(async (req, res, next) => {
  // 1) GETTING TOKEN AND CHECK IF IT IS THERE

  // 2) VALIDATE TOKEN (here jwt algo virifies if the orginal "signature" and send "signature" is valid)

  // 3) CHECK IF USER STILL EXISTS

  // 4) FINALLY CHECK IF USER TRY TO CHANGE PASSWORD AFTER THE TOKEN WAS ISSUED
  next();
});

///
//signup -> if we didn't check while signing up everyone will signup as a "Admin" so this is a serious security flow.

//payload : it is the object for all the data that we are going to store inside of the token.
//secret:  the secrete should atleast be 32 character long(longer the better).[ for the best Encryption we should atleast use 32 characters]
// the payload "header" will be creating automatically.

//  jwt.sign(payload, secret, next we are passing a options(i,e when should jwt expire[so this means after the "time" that  we are gonna pass here, json web token is no longer gonna be valid even it is correctly varified . this is basically for loging out the user after a certain period of time as a security measure] ))
//  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//    expiresIn: process.env.JWT_EXPIRES_IN
//  });

// JWT_EXPIRES_IN=90d --> means after 90days the jwt will no longer be valid even if the "Signature" is correct and everything is valid. It is just like additional security meansures.

//jwt.verify(token, secretOrPublicKey, [options, callback]) -> it is used to varify the token while the user loging in to check wheather the "signatiure"(payload,secret) is matching while user loging "signature".

//"iat": Issued At . "exp": Expiration Time

///  const user = User.findOne({email }); email --> it is the shortform of {email: email } in js. the field is called "email" and the variable is also called "email"

//const correct = user.correctPassword(password, user.password); ---->
//     ('password1234') === "$2a$12$9cECeu/c59WhS1HMuvENrOyE1iJBgX2YnmqisZgB1owMwylFRA54m" while user loging in we want to compare Posted password with the Encrypted password which is in the database. So to comapare we are using "Bcrypt" package.we use "Bcrypt" to create Hash(Encrypt) password and also to compare the Normal password with the Hashed password.(we are doing this in UserModel file)
