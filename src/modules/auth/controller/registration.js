import { userModel } from "../../../../DB/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../../../services/email.js";
import { nanoid } from "nanoid";

export const signUp = async (req, res) => {
  const { userName, email, password } = req.body;
  const user = await userModel.findOne({ email }).select("email");
  if (user) {
    res.status(409).json({ message: "Email already registered" });
  } else {
    const hash = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
    const savedUser = await userModel.create({
      email,
      userName,
      password: hash,
    });
    // const savedUser = await userModel.({
    //   email,
    //   userName,
    //   password,
    // });
    if (!savedUser) {
      res.status(400).json({ message: "Fail to register, please try again" });
    } else {
      const token = jwt.sign({ id: savedUser._id }, process.env.EMAILTOKEN);
      // console.log(token);
      const message = `
      <a href = ${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}>Confirm Email</a>
      `;
      await sendEmail(email, "confirmEmail", message);
      res.status(201).json({ message: "Done!" });
    }
  }
};

export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.EMAILTOKEN);
    if (!decoded?.id) {
      res.status(400).json({ message: "In-Valid Token Payload" });
    } else {
      const user = await userModel.updateOne(
        {
          _id: decoded.id,
          confirmEmail: false,
        },
        { confirmEmail: true }
      );
      user.modifiedCount
        ? res.status(200).json({ message: "Confirmed Done" })
        : res.status(400).json({ message: "Already Confirmed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(401).json({ message: "User Not Found" });
  } else {
    if (!user.confirmEmail) {
      res.status(401).json({ message: "Pls Confirm your Email First" });
    } else {
      const match = bcrypt.compareSync(password, user.password);
      if (!match) {
        res.status(401).json({ message: "Wrong Password" });
      } else {
        const token = jwt.sign(
          { id: user._id, isLoggedIn: true },
          process.env.SIGNINTOKEN,
          { expiresIn: 60 * 60 * 24 }
        );
        res.status(200).json({ message: "Done", token });
      }
    }
  }
};

export const sendCode = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email }).select("email");
  if (!user) {
    res.json({ message: "In-Valid Email" });
  } else {
    const code = nanoid();
    // const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    sendEmail(email, "Forget Password", `<h1>Access Code : ${code}</h1>`);
    const updatedUser = await userModel.updateOne(
      { _id: user._id },
      { code: code }
    );
    updatedUser.modifiedCount
      ? res.json({ message: "Done" })
      : res.json({ message: "Fail" });
  }
};

export const forgetPassword = async (req, res) => {
  const { code, newPassword, email } = req.body;
  if (code == null) {
    res.json({ message: "In-Valid Code" });
  } else {
    const hashPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.saltRound)
    );
    const user = await userModel.updateOne(
      { email, code },
      { password: hashPassword, code: null }
    );
    user.modifiedCount
      ? res.json({ message: "Done" })
      : res.json({ message: "In-valid Code" });
  }
};
