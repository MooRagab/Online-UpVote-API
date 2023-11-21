import { Router } from "express";
import * as RC from "./controller/registration.js";
import { validation } from "../../middleware/valdiation.js";
import * as validator from "./auth.validation.js";

const router = Router();

router.post("/signUp", validation(validator.signUp), RC.signUp);
router.get("/confirmEmail/:token", RC.confirmEmail);
router.post("/signIn", validation(validator.signIn), RC.signIn);
router.patch("/sendCode", validation(validator.sendCode), RC.sendCode);
router.patch(
  "/forgetPassword",
  validation(validator.forgetPassword),
  RC.forgetPassword
);

export default router;
