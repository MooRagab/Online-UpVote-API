import joi from "joi";

export const signUp = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi.string().required().min(3).max(15),
      email: joi.string().required().email().messages({
        "any.required": "Plz Send Your Email",
        "any.empty": "Plz Send Your Email",
        "string.email": "Plz Enter Valid Email",
        "string.base": "Email Accept String Value Only",
      }),
      password: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        )
        .required(),
      cPassword: joi.string().valid(joi.ref("password")).required(),
      gender: joi.string().valid("male", "female"),
    }),
};

export const signIn = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "any.required": "Plz Send Your Email",
        "any.empty": "Plz Send Your Email",
        "string.email": "Plz Enter Valid Email",
        "string.base": "Email Accept String Value Only",
      }),
      password: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        )
        .required(),
    }),
};

export const sendCode = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().required().email().messages({
        "any.required": "Plz Send Your Email",
        "any.empty": "Plz Send Your Email",
        "string.email": "Plz Enter Valid Email",
        "string.base": "Email Accept String Value Only",
      }),
    }),
};

export const forgetPassword = {
  body: joi
    .object()
    .required()
    .keys({
      code: joi.string().required(),
      email: joi.string().required().email().messages({
        "any.required": "Plz Send Your Email",
        "any.empty": "Plz Send Your Email",
        "string.email": "Plz Enter Valid Email",
        "string.base": "Email Accept String Value Only",
      }),
      newPassword: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        )
        .required(),
      cPassword: joi.string().valid(joi.ref("newPassword")).required(),
    }),
};
