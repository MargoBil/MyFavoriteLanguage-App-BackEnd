const {
    createNewUser,
    handleSignInReq,
    findUserByEmail,
    createNewToken,
    updateToken
  } = require('./users.services');
  const Joi = require('joi');
  const Jwt = require('jsonwebtoken');
  const userModel = require('./users.model');
  const {json} = require('body-parser');
  const {options} = require('joi');
  
  class UsersController {
    constructor() {
      this._costFactor = 4;
    }
  
    get signUp() {
      return this._signUp.bind(this);
    }
  
    async _signUp(req, res, next) {
      try {
        const newUser = await createNewUser(req.body, this._costFactor);
        if (!newUser) {
          res.status(409).json({
            message: 'Email in use',
          });
        }
        const {email, _id} = newUser;
        res.status(201).json({
          _id,
          email,
        });
      } catch (error) {
        next(error);
      }
    }
  
    async signIn(req, res, next) {
      try {
        const userFoundByEmail = await findUserByEmail(req.body);
        if (!userFoundByEmail) {
          res.status(401).json({message: 'Not authorized'});
        }
        const isReqValid = await handleSignInReq(req.body, userFoundByEmail);
        if (!isReqValid) {
          res.status(401).json({message: 'Not authorized'});
        }
        const token = await createNewToken(userFoundByEmail);
        const updateTokenResult = await updateToken(userFoundByEmail, token);
        res.status(200).json(updateTokenResult);
      } catch (error) {
        next(error);
      }
    }
  
    async logout(req, res, next) {
      try {
        const user = req.user;
        await updateToken(user._id, null);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  
    async getCurrentUser(req, res, next) {
      try {
        const currentUser = req.user;
        const {email, subscription} = currentUser;
        return res.json({email, subscription});
      } catch (error) {
        next(error);
      }
    }
  
    validateReqBodyForAuth(req, res, next) {
      const validateRules = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
      });
      const validResult = validateRules.validate(req.body);
      if (validResult.error) {
        return res
          .status(400)
          .json('Error from Joi or another validation library');
      }
      next();
    }
  
    async authorizeValidation(req, res, next) {
      try {
        const authorizationHeader = req.get('Authorization');
        const token = authorizationHeader.replace('Bearer ', '');
        let userId = await Jwt.verify(token, process.env.TOKEN_SECRET)._id;
        if (!userId) {
          return res.status(401).json({message: 'Not authorized'});
        }
        const user = await userModel.findById(userId);
        if (!user || user.token !== token) {
          return res.status(401).json({message: 'Not authorized'});
        }
        req.user = user;
        req.token = token;
  
        next();
      } catch (error) {
        next(error);
      }
    }
  }
  
  module.exports = new UsersController();
  