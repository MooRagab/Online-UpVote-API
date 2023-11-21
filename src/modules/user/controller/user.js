import { userModel } from "../../../../DB/models/user.model.js";
import cloudinary from "../../../services/cloudinary.js";
import bcrypt from "bcrypt";

export const getProfileData = async (req, res) => {
  try {
    const profile = await userModel.findById(req.user._id);
    res.status(200).json({ message: "Done", profile });
  } catch (error) {
    res.status(500).json({ message: "Catch Error", error });
  }
};

export const profilePic = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Pls Upload your profile Picture" });
    } else {
      const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: `user/${req.user._id}/profilePic`,
      });
      const user = await userModel.findOneAndUpdate(
        { _id: req.user._id },
        {
          profilePic: secure_url,
        }
      );
      res.status(200).json({ message: "Done" });
    }
  } catch (error) {
    res.status(500).json({ message: "Catch Error", error });
  }
};

export const profileCoverPic = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Pls Upload your Cover Picture" });
    } else {
      const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: `user/${req.user._id}/profileCoverPic`,
      });
      const user = await userModel.findOneAndUpdate(
        { _id: req.user._id },
        {
          coverPic: secure_url,
        }
      );
      res.status(200).json({ message: "Done" });
    }
  } catch (error) {
    res.status(500).json({ message: "Catch Error", error });
  }
};

export const updateUserName = async (req, res) => {
  const { userName, password } = req.body;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
  } else {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ message: "Wrong Password" });
    } else {
      await userModel.updateOne({ userName });
      res
        .status(200)
        .json({ message: `Done And your New UserName Is ${userName}` });
    }
  }
};
