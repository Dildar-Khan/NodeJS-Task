import { StatusCodes } from 'http-status-codes';
import User from './user.model';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import userService from './user.service';

export default {
  async signup(req, res) {
    try {
      const { error, value } = userService.validateSignupSchema(req.body);
      if (error && error.details) {
        return res.status(StatusCodes.BAD_REQUEST).json(error);
      }
      const existingUser = await User.findOne({ email: value.email });
      if (existingUser) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: 'You already have an account, please login' });
      }
      const user = new User();
      user.userName = value.userName;
      user.email = value.email;
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(value.password, salt);
      user.password = hash;
      await user.save();
      return res.json({ message: 'account created successfully' });
    } catch (err) {
      console.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  },

  async login(req, res) {
    try {
      const { error, value } = userService.validateLoginSchema(req.body);
      if (error && error.details) {
        return res.status(StatusCodes.BAD_REQUEST).json(error);
      }
      const user = await User.findOne({ email: value.email });
      if (!user) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: 'invalid email' });
      }
      bcryptjs.compare(value.password, user.password, (err, result) => {
        if (err) {
          throw new Error(err);
        }
        if (result) {
          const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: '1d',
          });
          return res.status(StatusCodes.OK).json({ success: true, token });
        } else {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: 'wrong password' });
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};
