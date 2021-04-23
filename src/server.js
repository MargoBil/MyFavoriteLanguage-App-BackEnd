const express = require('express');
const cors = require('cors');
require('dotenv').config();
const dictionaryRouters = require('./dictionary/dictionary.routers');
const authRouter = require('./users/auth.routers');
const usersRouter = require('./users/user.routers');
const morgan = require('morgan');
const mongoose = require('mongoose');
const whitelist = [
  'http://localhost:4200',
  'https://my-favorite-language.herokuapp.com/',
];

module.exports = class Server {
  constructor() {
    this.server = null;
  }

  async startServer() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDataBase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    const corsOptions = {
      origin: function (origin, callback) {
        if (whiteList.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    };
    this.server.use(cors(corsOptions));
  }

  initRoutes() {
    this.server.use('/dictionary', dictionaryRouters);
    this.server.use('/auth', authRouter);
    this.server.use('/users', usersRouter);
  }

  startListening() {
    this.server.listen(process.env.PORT || 3000, () => {
      console.log('Server started listening on port', process.env.PORT || 3000);
    });
  }
  async initDataBase() {
    try {
      const {MONGODB_URL} = process.env;
      await mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});
      console.log('Database connection successful');
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
};
