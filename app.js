require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookies = require('cookie-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');

const { PORT = 3000, mongoDbPath, NODE_ENV } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
});
app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', ['http://localhost:3000']);
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Allow-Methods', ['PUT', 'GET', 'POST', 'DELETE', 'PATCH']);
  res.set('Access-Control-Allow-Credentials', 'true');
  res.send('ok');
});

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cookies());

app.use(express.json());

app.use('/', router);

mongoose.connect(NODE_ENV === 'production' ? mongoDbPath : 'mongodb://localhost:27017/xenBlogDb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('App listening on port:', PORT);
});
