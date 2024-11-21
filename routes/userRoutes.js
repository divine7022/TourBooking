const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');
//[OR]
// const { getAllUsers, createUser, getUser, updateuser, deleteuser } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', authController.signup); // this route doesn't follow s the "Rest" phelosophy.[if it is a /users then it follows]

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// Mounting the router should come after all of these👆 definations , after we declare the variable.

module.exports = router;
