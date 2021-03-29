const {Router} = require('express');
const {getWords, findWordById, postWord, deleteWordById, updateWordById, validateId, validatePostNewWord, validatePatchNewWord, } = require('./dictionary.controller');

const dictionaryRouter = Router();

//get all words:
dictionaryRouter.get("/", getWords);

//post word:
dictionaryRouter.post("/", validatePostNewWord, postWord);

//get word by id:
dictionaryRouter.get("/:wordId", validateId, findWordById);

//update word by id:
dictionaryRouter.patch("/:wordId", validateId, validatePatchNewWord, updateWordById);

//delete word by id:
dictionaryRouter.delete("/:wordId", validateId, deleteWordById);

module.exports = dictionaryRouter;