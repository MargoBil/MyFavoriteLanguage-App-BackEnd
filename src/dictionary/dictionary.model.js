const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

// const wordSchema = new Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: { type: String, required: true },
//   subscription: { type: String, required: true, alias: "Sub" },
//   password: { type: String, required: true },
//   token: { type: String, required: false },
// });

const wordSchema = new Schema({
  language: { type: String, required: true },
  word: { type: Array, required: true },
  translateLanguage: { type: String, required: true },
  translateWord: { type: Array, required: true },
  token: { type: String, required: false },
});

wordSchema.plugin(mongoosePaginate);
const wordModel = mongoose.model("Word", wordSchema);

module.exports = wordModel;
