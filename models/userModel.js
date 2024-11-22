//requiring mongooes package.
const mongoose = require('mongoose');
const validator = require('validator'); // it is package contains inbuilt liberaries for validtaion of email, etc... So that we no need to crate validation function by our self.
const bcrypt = require('bcryptjs');

// Creating a Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'] // custom validator.
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8, // rule to be a password
    select: false // means we don't to send the passowrd to the client as a response when we do get(get all users) and "post" request as a response. Then it will automatically never showup in any output.
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // we are creating a custom validators to check the password
    validate: {
      //here we are going to create a callback function. which is then called when a new document is created. Here we are not using the arrow function cuz we want "this" keyword.
      // THIS VALIDATOR ONLY WORKS ON "CREATE" and "SAVE".(so when ever we "update" the document we also want to SAVE. then only the password will validate.)
      validator: function(el) {
        return el === this.password; //here we will check wheather the password and the passwordConfirm is same or not.
      },
      // this is a message if we get an error
      message: 'Password are not the same!'
    }
  }
});

//ENCRYPTING THE PASSWORD: or also it is called as HASHING THE PASSWORD.
//the reason i am doing the "pre" to the middleware is cuz i need to "Encrypt" the password befor "SAVING" the password to the Database.
userSchema.pre('save', async function(next) {
  // ONLY RUN THIS FUNCTION IF PASSWORD WAS ACTUALLY MODIFIED.
  if (!this.isModified('password')) return next();

  //HASH THE PASSWORD WITH COST OF 12(salt rounds)
  this.password = await bcrypt.hash(this.password, 12); // We are Hashing the password."12" is a "salt rounds"(means number of times hashing)

  // DELETE THE PASSWORD WITH FILED "passwordConfirm"
  this.passwordConfirm = undefined; // this is the way to delete the confirm password(cuz after validating we no longer need this password).
  next();
});

//The function which will check the password(enterd while logingin) is the same as the one stored in the document(in db).
// ('password1234') === "$2a$12$9cECeu/c59WhS1HMuvENrOyE1iJBgX2YnmqisZgB1owMwylFRA54m"
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  //"this" points to document in that we set the password to "false" .cuz of that "this.password" will not be availabe.
  return await bcrypt.compare(candidatePassword, userPassword); // it compares the password in the document(in Encrypted form) and the password provide by the user(by POST REQ)which is in normal form. And return "true" or "false" if the password matches.
};

//Model variable first letter should be Capital letter.
const User = mongoose.model('User', userSchema);

module.exports = User;

/////
// HASHING: we are going to encrypt or hash the password using very popular Hashing Algorithm called "Bcrypt" . So this algorithm will first will solve and then Hash our password in order to make it realy strong and to protect against "Brootforce" attacks. that is the hole reason the encryption need to be realy strong. cuz "Brootforce attacks" will try to guess the passwords if it is not storngly Encrypted.

//the "if" condition here cuz, the password need to only Encrypt when we are "Updating" the password. not when we update the "email" or etc..
//if (!this.isModified('password')) return next();

// in the end we need to delete the conform password, cuz at this point of time we only have the real password "Hashed"
//this.passwordConfirm = undefined; // this is the way to delete the confirm password(cuz after validating we no longer need this password).

// the "Bcrypt" algorithm is gona add random string to the password so that the two equal password do not generate the same Hash.

// candidatePassword --> the password the user passes in the body(by post request)
