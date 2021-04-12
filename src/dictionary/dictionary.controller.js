const Joi = require("joi");
const wordModel = require("./dictionary.model");

const {
  Types: { ObjectId },
} = require("mongoose");
const {
  dictionaryList,
  getWordById,
  removeWord,
  addWord,
  updateWord,
} = require("./dictionary.services");
const { object } = require("joi");

class DictionaryController {
  async getWords(req, res, next) {
    try {
      const { page, limit } = req.query;
      const options = { page: page, limit: limit };
      const dataLength = await wordModel.find();
      let data;

      if (
        Object.keys(req.query)[0] === "page" &&
        Object.keys(req.query)[1] === "limit"
      ) {
        return wordModel.paginate({}, options, (err, result) => {
          if (err) {
            return console.log(err);
          }
          data = {total: dataLength.length, data: result.docs};
          return res.status(200).json(data);
        });
      }

      data = {total: dataLength.length, data: await dictionaryList()}

      if (!data) {
        return res.status(404).json({ message: "Not Found" });
      }
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async findWordById(req, res, next) {
    try {
      const id = ObjectId(req.params.wordId);
      const data = await getWordById(id);
      if (!data) {
        return res.status(404).json({ message: "Not Found" });
      }
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async postWord(req, res, next) {
    try {
      const data = await addWord(req.body);
      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async deleteWordById(req, res, next) {
    try {
      const id = ObjectId(req.params.wordId);
      const data = await removeWord(id);
      if (!data) {
        return res.status(404).json({ message: "Not Found" });
      }
      return res.status(200).json({ message: "contact deleted" });
    } catch (error) {
      next(error);
    }
  }

  async updateWordById(req, res, next) {
    try {
      const id = ObjectId(req.params.wordId);
      const data = await updateWord({ _id: id }, req.body);
      if (!data) {
        return res.status(404).json({ message: "Not Found" });
      }
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  validateId(req, res, next) {
    const { wordId } = req.params;

    if (!ObjectId.isValid(wordId)) {
      return res.status(400).send("This  id does not exist");
    }

    next();
  }

  validatePostNewWord(req, res, next) {
    const postDictionaryRules = Joi.object({
      language: Joi.string().required(),
      word: Joi.array().required(),
      translateLanguage: Joi.string().required(),
      translateWord: Joi.array().required(),
    });
    const validResult = postDictionaryRules.validate(req.body);
    if (validResult.error) {
      return res.status(400).json({ message: "missing required name field" });
    }
    next();
  }

  validatePatchNewWord(req, res, next) {
    const patchDictionaryRules = Joi.object({
      language: Joi.string().required(),
      word: Joi.array().required(),
      translateLanguage: Joi.string().required(),
      translateWord: Joi.array().required(),
    });
    const validResult = patchDictionaryRules.validate(req.body);
    const isResultEmpty = Object.keys(validResult.value).length === 0;
    if (isResultEmpty) {
      return res.status(400).json({ message: "missing fields" });
    }
    next();
  }
}

module.exports = new DictionaryController();
