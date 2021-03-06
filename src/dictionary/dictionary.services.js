const wordModel = require("./dictionary.model");

async function dictionaryList(userId) {
  try {
    const wordsList = await wordModel.find({ userId });
    const filteredList = wordsList.map((item) => {
      return {
        language: item.language,
        word: item.word,
        translateLanguage: item.translateLanguage,
        translateWord: item.translateWord,
        data: Date.parse(item.data),
      };
    });
    return filteredList.sort((a, b) => b.data - a.data);
  } catch (error) {
    console.log(error);
  }
}

async function getWordById(wordId) {
  try {
    const word = await wordModel.findOne(wordId);
    return word;
  } catch (error) {
    console.log(error);
  }
}

async function getWordByName(userId, word) {
  let response;
  try {
    response = [
      ...(await wordModel.find({ userId, word }, { userId: 0 })),
      ...(await wordModel.find({ userId, translateWord: word }, { userId: 0 })),
    ];
    return response;
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

async function addWord(bodyChunk, userId) {
  try {
    const newWord = await wordModel.create({
      ...bodyChunk,
      data: Date.now(),
      userId: userId,
    });
    const response = {
      language: newWord.language,
      translateLanguage: newWord.translateLanguage,
      word: newWord.word,
      translateWord: newWord.translateWord,
      data: newWord.data,
    };
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function updateWord(wordId, bodyChunk) {
  try {
    const updatedWord = await wordModel.findOneAndUpdate(
      wordId,
      { $set: bodyChunk },
      { new: true }
    );
    return updatedWord;
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
  getWordByName,
};
