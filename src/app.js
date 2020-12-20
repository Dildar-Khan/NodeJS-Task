import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { config } from './api/config/config';
import { mainRouter } from './api/index';
import { setGlobalMiddleware } from './api/middleware/globalMiddleware';

const app = express();

mongoose.Promise = global.Promise;
const mongoDBUrl = config.database;
const PORT = config.port;

mongoose
  .connect(mongoDBUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((db) => {
    console.log('Database is connected now');
  })
  .catch((error) => console.log(error));

setGlobalMiddleware(app);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api', mainRouter);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.message = 'Invalid route';
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(PORT, () => {
  console.log('Server is running at PORT', PORT);
});
