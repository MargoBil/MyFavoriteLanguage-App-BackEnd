const { Router } = require("express");
const {
  getWords,
  findWordById,
  findWordByName,
  postWord,
  deleteWordById,
  updateWordById,
  validateId,
  validatePostNewWord,
  validatePatchNewWord,
  authorize
} = require("./dictionary.controller");

const dictionaryRouter = Router();

//get all words:
dictionaryRouter.get("/", authorize, getWords);

//post word:
dictionaryRouter.post("/", authorize, validatePostNewWord, postWord);

//get word by id:
dictionaryRouter.get("/:wordId", authorize, validateId, findWordById);

//get word by name:
dictionaryRouter.get("/search/:wordName", authorize, findWordByName);

//update word by id:
dictionaryRouter.patch(
  "/:wordId",
  authorize,
  validateId,
  validatePatchNewWord,
  updateWordById,
);

//delete word by id:
dictionaryRouter.delete("/:wordId", authorize, validateId, deleteWordById);

module.exports = dictionaryRouter;
