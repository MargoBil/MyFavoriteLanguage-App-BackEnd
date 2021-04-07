const wordModel = require("./dictionary.model");

async function dictionaryList() {
  try {
    const wordsList = await wordModel.find();
    const filteredList = wordsList.map((item) => {
      return {
        language,
        word,
        translateLanguage,
        translateWord,
      };
    });
    return filteredList;
  } catch (error) {
    console.log(error);
  }
}

async function getWordById(wordId) {
  try {
    const contact = await wordModel.findOne(wordId);
    return contact;
  } catch (error) {
    console.log(error);
  }
}

async function removeWord(wordId) {
  try {
    const deletedWord = await wordModel.findByIdAndDelete(wordId);
    return deletedWord;
  } catch (error) {
    console.log(error);
  }
}

async function addWord(bodyChunk) {
  console.log(bodyChunk);
  try {
    const newWord = await wordModel.create(bodyChunk);
    return newWord;
  } catch (error) {
    console.log(error);
  }
}

async function updateWord(wordId, bodyChunk) {
  try {
    const udatedWord = await wordModel.findOneAndUpdate(
      wordId,
      { $set: bodyChunk },
      { new: true }
    );
    return udatedWord;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  dictionaryList,
  getWordById,
  removeWord,
  addWord,
  updateWord,
};
