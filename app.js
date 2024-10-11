const fs = require('fs'); // this is a core moduel(should be always at the beginnig)
const express = require('express');

const app = express();

app.use(express.json()); // here express.json is middleware

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endport...');
// });

//Now it will be in the top level code.(will execute only once at the beginning. cuz get rid of call back heel if i write inside the app.get())
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  // when the user search this url then we need to send the response.
  // still 200 is the satanderd, it is good practice to specify the "status"
  res.status(200).json({
    // .json is use here to send the data in a json formate
    status: 'success',
    results: tours.length,
    data: {
      // tours: tours,
      tours,
    },
  });
});

// "post" is used to create a new tour. but the url will be same as "get" method
// the "req" object holds all the data/info about the request that was done.
// in order to have/add that data to the "api" post method uses a "middleware"
app.post('/api/v1/tours', (req, res) => {
  console.log(req.body);
  res.status(200).send('Done'); // Sending a success response
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

/////// ---COMMENTS---///

///app.get('/api/v1/tours', (req, res) => {}
//* the purpose of writing v1 is : if we want to make any changes then we can make it by creating the v2 .cuz we should not effect to any users of the v1 by our changes or updates.So we always should specify the version of the api.
// this callback((req, res) => {}) is called the Route handler.
//* this callback((req, res) => {}) is called the Route handler.
//* when the user search this url then we need to send all of the data.
//* here "tours" is a resources now in the above url.

/// __dirname : is the folder where the current script is available(i,e the main folder).

///const tours = JSON.parse(  --> So that the json that we have here automatically be converted to an array of javaScript object.

///data: {
//    tours: tours, // this is read by the tours-simple.json file
//    tours, // just tours cuz both key and value pair have the same name
//   },

///app.use(express.json()); // here express.json is middleware
// middleware : the middleware basically just a function that modify the incomming request data.
// express.json , is called as middleware cuz it stands between in the middle of the "request" and the "resoponce"
// console.log(req.body) -> req.body (body is the property that is gonna be available on the request, cuz we use that middleware a couple of minutes ago )
