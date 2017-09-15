import bodyParser from 'body-parser';
import config from './config';
import routes from './routes';
import express from 'express';
import mongoose from 'mongoose';
import logger from 'morgan';
import path from 'path';

const app = express();
app.disable('x-powered-by');

app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}));

// Models
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));


// Routes
Object
  .keys(routes.controllers)
  .map(key => routes.controllers[key])
  .forEach(controller => {
    app.use('/', controller)
  })

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res
    .status(err.status || 500)
    .send({message: err.message});
});

export default app;
