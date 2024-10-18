const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(process.env); // by this we can see all the environment variables.

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});
