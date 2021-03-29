const { string } = require('joi');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
  name: {type: String, require: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  token: {type: String, required: false},
});
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
