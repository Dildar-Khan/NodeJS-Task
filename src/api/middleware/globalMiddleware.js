import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import logger from 'morgan';
import passport from 'passport';

import { config } from '../config/config';
import { configureJWTStrategy } from './passport-jwt';
import User from '../user/user.model';

export const setGlobalMiddleware = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use(logger('dev'));
  app.use(
    session({
      secret: config.secret,
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize({ userProperty: 'currentUser' }));
  app.use(passport.session());
  configureJWTStrategy();

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(null, user);
    });
  });
};
