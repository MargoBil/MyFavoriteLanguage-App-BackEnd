const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const wordSchema = new Schema({
  language: { type: String, required: true },
  word: { type: Array, required: true },
  translateLanguage: { type: String, required: true },
  translateWord: { type: Array, required: true },
  data: { type: Date, required: true },
  token: { type: String, required: true },
});

wordSchema.plugin(mongoosePaginate);
const wordModel = mongoose.model("Word", wordSchema);

module.exports = wordModel;
