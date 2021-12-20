const fs = require('fs');
const express = require('express');
const userController = require('../Controllers/usersController');
const authController = require('../Controllers/authController');

// const currentuser = JSON.parse(
//   fs.readFileSync(`${__dirname}/../Users/CurrentUser.json`)
// );

const usersRoute = express.Router();

usersRoute
  .get('/', userController.getUsers)
  // .post('/', userController.addUser)
  .patch('/:id', () => {})
  .delete('/:id', () => {});

usersRoute
  .post('/signup', authController.signup)
  .post('/login', authController.login);

// usersRoute.get('/currentuser', (req, res) => {
//   res.status(200).send(currentuser);
// });

module.exports = usersRoute;
