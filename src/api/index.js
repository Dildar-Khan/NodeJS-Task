import express from 'express';

import { articleRouter } from './article/index';
import { userRouter } from './user/index';

export const mainRouter = express.Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/article', articleRouter);
