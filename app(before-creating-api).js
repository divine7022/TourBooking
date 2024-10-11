const express = require('express');

// creating a varibale app is just a convention and assigning it to the express varibale
const app = express(); // express is a function which we declared above which gives a bunch of the methods.

app.get('/', (req, res) => {
  // now we need to send some data back to the requet made by the "get" method.
  // res.send('Hello from the server side!'); we can also specify the status code.
  // res.status(200).send('Hello from the server side!'); insterd of using the ".send" we can also use the ".json"
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post to this endport...');
});

const port = 3000;
// here we pass in the 'port' and the "call back" function. and this is the callback function that will be called as soon as the server starts listening.
app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});
//// 👆 that is now the server alredy listening.
// we need to do next, is to define routs. but we actually created Routes in a  Node-farm project but in express it works differently.

/////// ---COMMENTS---///

//http is a method which is used for that(here that request means the request made by the url of the router) request
// Routing means to determine how an application response to certain "clint" request so to a certain url. So its not just a url but also the http "method(get)" which is used for that request
///-->app.get('/');
//1)app then the http method we want to respond(.get) and then url(i,e root here).
//2) when someone hit that url with a "get" request. So what ever we want to use that we need to specify in a callback function as a second parameter

//res
//.status(200)
//.json({ message: 'Hello from the server side!', app: 'Natours' });
//}); By using this .json method here this will automatically set our contet type to application json(but we did it manually in the "node-form" project when we creatd our first api but we also send back some json  )
