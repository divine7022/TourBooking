const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

// here we are replacing the password field which is the Database string with my original Database password.
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successfull'));

// Creating a Schema.
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // it is like a validater
    unique: true
  },
  reating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    requeired: [true, 'A tour must have price']
  }
});

// Creating a Models.
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Park Camper',
  price: 997
});

//when we are saving it will return the promice so we are using then.
testTour
  .save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.log('ERROR: ', err);
  });

// console.log(process.env); // by this we can see all the environment variables.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

////////

// const port = process.env.PORT || 3000; -> The || operator is only used to provide a fallback value if process.env.PORT is undefined or empty. [Use the value of process.env.PORT if it's defined; otherwise, default to 8000." It doesn’t automatically switch to another port if 8000 is in use.]

///  MONGODB:
// 1) here we first installed the mongoess driver. from the vs code terminal.
// connect is a method we are calling on the mongooes variable.
// here while connecting first argument will be connection string which is in config.env and second argument we should give some options to deal with deprication warnings. Always we should use the exact same syntax.
// the .connect() method will return a promice we should handle that using "then". then it will get a connection object which we are calling here as a "con"

//  .connect(process.env.DATABASE_LOCAL, { --> in case if we want to connect to local database then insterd of database string("DB") use the above given local database varibale which is defied in the config.env
// if we want to use the hosted database then use then use the database string variable defined in the config.env

// required: true, --> means it is like saying this field is required ,this field should compulsory while input.
// name: {
//  type: String,
//  required: [true, "A tour must have a name"]   --> this 2nd parament is error to display when not entered
//},   --> these options inside the name is schema is called as schemea type.

// const Tour = mongoose.model('Tour', tourSchema); --> creating a mode 1st parameter is name of the model and the 2nd paramenter is the name of the schema.

// now we will use the model(it is like a instance of a class) to create the the document of to the Tours database.
