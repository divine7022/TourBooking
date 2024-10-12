const fs = require('fs'); // this is a core moduel(should be always at the beginnig)
const express = require('express');
const { status } = require('express/lib/response');

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
  // now the string object will be converted to the js object.
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

// we are creating a parameters to access perticular item(here "id" is a variable).
// the variable in the url "id" is called params
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1; // this id will be in the "string" formate so we need to convert it into number.(so to convert into number this is the small nice trick)
  // const tour = tours.find((el) => el.id === req.params); //"req.params" will contatis the id we entered in the url. we shouldn't use this cuz req.params gives an id object not the value.

  const tour = tours.find((el) => el.id === id); //we need to use only the "id" in order to get the value of the id.

  // if we searched a id that is not exist in that case we need to send a 404 error.
  // if(id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    // results: tours.length,
    data: {
      tour, //if we want to create a same name of the property as a value name then just (tour)
    },
  });
});

// "post" is used to create a new tour. but the url will be same as "get" method
// the "req" object holds all the data/info about the request that was done.
// in order to have/add that data to the "api" post method uses a "middleware"
app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  // const newTour = res.status(200).send('Done'); // Sending a success response
  // to assign the newId to the data that we send
  const newId = tours[tours.length - 1].id + 1; // here the newId will be older data last id + 1.
  const newTour = Object.assign({ id: newId }, req.body);
  // Now we need to push this tour into the tours array.
  tours.push(newTour);
  // Now we need to persist that into the file(by writing it into the file Asyncrounously, cuz we should not block execn)
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours), // it converts the js object into the string manner how it was initially
    (err) => {
      // now we will send the newly created object as a response.
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    // (*1) is to conver it to the number
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    // (*1) is to conver it to the number
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
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
///  console.log(req.body);
// the req object holds all the data/info about the request that was done. if that request contains some data that was sent then that data should be on the request.

// which allows us to create a new object by merging together with an existing object
