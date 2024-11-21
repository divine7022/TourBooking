// //requiring mongooes package.
// const mongoose = require('mongoose');
// const validator = require('validator'); // it is package contains inbuilt liberaries for validtaion of email, etc... So that we no need to crate validation function by our self.
// const { default: isEmail } = require('validator/lib/isEmail');

// // creating a Schema
// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please tell us your name!']
//   },
//   email: {
//     type: String,
//     required: [true, 'Please provide your email'],
//     unique: true,
//     lowercase: true,
//     validate: [validator, isEmail, 'Please provide a valid email'] // custom validator.
//   },
//   photo: String,
//   password: {
//     type: String,
//     required: [true, 'Please provide a password'],
//     minlength: 8 // rule to be a password
//   },
//   passwordConfirm: {
//     type: String,
//     required: [true, 'Please confirm your password']
//   }
// });

// //Model variable first letter should be Capital letter.
// const User = mongoose.model('User', userSchema);

// module.exports = User;
