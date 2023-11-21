import joi from "joi";

export const updateUserName = {
  body: joi
    .object()
    .required()
    .keys({ 
      userName: joi.string().required().min(3).max(15),
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
