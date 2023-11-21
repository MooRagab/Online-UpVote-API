import jwt from "jsonwebtoken";
import { userModel } from "../../DB/models/user.model.js";

export const auth = () => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;

      // console.log(authorization);

      if (!authorization?.startsWith(process.env.BEARERKEY)) {
        res.status(400).json({ message: "In-Valid Bareaer Key" });
      } else {
        const token = authorization.split(process.env.BEARERKEY)[1];
        const decoded = jwt.verify(token, process.env.SIGNINTOKEN);
        if (!decoded?.id) {
          res.status(400).json({ message: "Invalid token payload" });
        } else {
          const user = await userModel
            .findById(decoded.id)
            .select("userName email profilePic role");
          if (!user) {
            res.status(401).json({ message: "Not Register User" });
          } else {
            req.user = user;
            next();
          }
        }
      }
    } catch (error) {
      res.status(500).json({ message: "Catch Error", error });
      //   console.log(error);
    }
  };
};
