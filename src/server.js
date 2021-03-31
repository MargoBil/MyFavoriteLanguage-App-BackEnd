const express = require('express');
const cors = require('cors');
require('dotenv').config();
const dictionaryRouters = require('./dictionary/dictionary.routers');
const authRouter = require('./users/auth.routers');
const usersRouter = require('./users/user.routers');
const morgan = require('morgan');
const mongoose = require('mongoose');

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
    this.server.use(
      cors({
        origin: 'https://localhost:3000',
      }),
    );
    this.server.use(morgan('dev'));
  }

  initRoutes() {
    this.server.use('/dictionary', dictionaryRouters);
    this.server.use('/auth', authRouter);
    this.server.use('/users', usersRouter);
  }

  startListening() {
    this.server.listen(process.env.port || 3000, () => {
      console.log('Server started listening on port', process.env.port || 3000);
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
