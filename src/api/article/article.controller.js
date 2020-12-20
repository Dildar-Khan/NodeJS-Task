import { StatusCodes } from 'http-status-codes';

import Article from './article.model';

export default {
  async createArticle(req, res) {
    try {
      const url = req.protocol + '://' + req.get('host');
      const data = new Article({
        title: req.body.title,
        body: req.body.body,
        image: url + '/images/' + req.file.filename,
      });
      const article = await Article.create(data);
      return res.json(article);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  },

  async updateArticle(req, res) {
    try {
      let image = req.body.image;
      if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        image = url + '/images/' + req.file.filename;
      }
      const data = new Article({
        _id: req.params.id,
        title: req.body.title,
        body: req.body.body,
        image: image,
      });
      const article = await Article.findByIdAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      if (!article) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: 'Article not found' });
      }
      return res.json(article);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  },

  async deleteArticle(req, res) {
    try {
      const article = await Article.findByIdAndRemove(req.params.id);
      if (!article) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ err: 'Could not delete the article' });
      }
      return res.json({ msg: 'Article deleted' });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};
