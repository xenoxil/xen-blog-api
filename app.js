import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookies from 'cookie-parser';
import { errors } from 'celebrate';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes/index.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';

dotenv.config();
const swaggerFile = JSON.parse(fs.readFileSync('./swagger/output.json'));
const { PORT = 3000, mongoDbPath, NODE_ENV } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
});
// app.options('*', (req, res) => {
//   res.set('Access-Control-Allow-Origin', ['http://localhost:3000']);
//   res.set('Access-Control-Allow-Headers', 'Content-Type');
//   res.set('Access-Control-Allow-Methods', ['PUT', 'GET', 'POST', 'DELETE', 'PATCH']);
//   res.set('Access-Control-Allow-Credentials', 'true');
//   res.send('ok');
// });

app.use(cors());

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cookies());

app.use(express.json());

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
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
