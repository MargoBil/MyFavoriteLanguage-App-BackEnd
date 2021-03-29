const {Router} = require('express');
const {authorizeValidation, getCurrentUser} = require('./users.controllers')

const usersRouter = Router();

//current user:
usersRouter.get("/current", authorizeValidation, getCurrentUser);

module.exports = usersRouter;