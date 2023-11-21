import { Router } from "express";
import * as userController from "../user/controller/user.js";
import { auth } from "../../middleware/auth.js";
import { HME, fileValidation, myMulter } from "../../services/multer.js";
import { validation } from "../../middleware/valdiation.js";
import * as validator from "./user.validation.js";

const router = Router();

router.get("/profile", auth(), userController.getProfileData);
router.patch(
  "/profilePic",
  auth(),
  myMulter(fileValidation.image).single("image"),
  HME,
  userController.profilePic
);
router.patch(
  "/profileCoverPic",
  auth(),
  myMulter(fileValidation.image).single("image"),
  HME,
  userController.profileCoverPic
);
router.patch(
  "/updateusername",
  auth(),
  validation(validator.updateUserName),
  userController.updateUserName
);

export default router;
