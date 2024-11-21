const mongoose = require('mongoose');

const dotenv = require('dotenv');

//HANDLING UNCAUGHT EXCEPTION:(EX: Trying to access something which is not exist like[console.log(x)] we didn't declare x.)
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1); // 1 indicates the process ended due to an error
});

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
// .catch(err => console.log('ERROR')); // this catch block to handle when we faild to connect to database.

// console.log(process.env); // by this we can see all the environment variables.
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

//UNHANDLED PROMISE REJECTIONS(handleing the error outside of the express)
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  // process.exit(1); // 0 stands for success and 1 stands for uncalled exception.This(process.exit(1)) will immidetly exit the process.
  // Gracefully(slowly not suddenly) shut down the server by completing any ongoing requests first
  server.close(() => {
    // After the server finishes, we exit the process
    process.exit(1); // 1 indicates the process ended due to an error
  });
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

// // process.exit(1); // 0 stands for success and 1 stands for uncalled exception.This will immidetly exit the process that should not happen so we need to Shutdown gracefully.
// Gracefully shut down the server by completing any ongoing requests first
//  server.close(() => {
// by doing "server.close" we are give the time to server to finish all the requests that are still pending or being handled at the time only afer that "server" is closed.
// Shutingdown slowly(not suddenly)
