import Joi from 'joi';
export default {
  validateSignupSchema(body) {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      userName: Joi.string().required(),
    });
    const { error, value } = schema.validate(body);
    if (error && error.details) {
      return { error };
    }
    return { value };
  },
  validateLoginSchema(body) {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const { error, value } = schema.validate(body);
    if (error && error.details) {
      return { error };
    }
    return { value };
  },
};
