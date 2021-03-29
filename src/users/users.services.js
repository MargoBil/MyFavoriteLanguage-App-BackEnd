const userModel = require('./users.model');
const bcryptjs = require('bcryptjs');
const Jwt = require('jsonwebtoken');
require('dotenv').config();

async function createNewUser(bodyChunk, costFactor) {
  try {
    const {password, email, name} = bodyChunk;
    const passwordHash = await bcryptjs.hash(password, costFactor);
    console.log(bodyChunk);
    const newUser = await userModel.create({
      name,
      email,
      password: passwordHash,
    });
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

async function findUserByEmail(bodyChunk) {
  const {email} = bodyChunk;
  try {
    const foundUserByEmail = await userModel.findOne({email});
    return foundUserByEmail;
  } catch (error) {
    console.log(error);
  }
}

async function handleSignInReq(bodyChunk, user) {
  const {password: userPassword} = bodyChunk;
  const {password} = user;
  try {
    const isPasswordValid = await bcryptjs.compare(userPassword, password);
    return isPasswordValid;
  } catch (error) {
    console.log(error);
  }
}

async function createNewToken(user) {
  const {id} = user;
  try {
    const token = Jwt.sign({_id: id}, process.env.TOKEN_SECRET);
    return token;
  } catch (error) {
    console.log(error);
  }
}

async function updateToken(user, token) {
  const {_id, email} = user;
  try {
    await userModel.findByIdAndUpdate({_id}, {token});
    return {
      token,
      user: {email},
    };
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  createNewUser,
  handleSignInReq,
  findUserByEmail,
  createNewToken,
  updateToken,
};
