import express from 'express';
import articleController from './article.controller';
import uploadFile from '../middleware/file';
import passport from 'passport';

export const articleRouter = express.Router();

articleRouter.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  uploadFile,
  articleController.createArticle
);
articleRouter.put(
  '/update/:id',
  passport.authenticate('jwt', { session: false }),
  uploadFile,
  articleController.updateArticle
);
articleRouter.delete(
  '/delete/:id',
  passport.authenticate('jwt', { session: false }),
  articleController.deleteArticle
);
