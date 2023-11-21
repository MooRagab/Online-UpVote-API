import { Router } from "express";
import * as postController from "./controller/post.js";
import { auth } from "../../middleware/auth.js";
import { HME, fileValidation, myMulter } from "../../services/multer.js";
import * as commentController from "./controller/comment.js";

const router = Router();

router.post(
  "/createpost",
  auth(),
  myMulter(fileValidation.image).array("image", 5),
  HME,
  postController.createPost
);
router.get("", postController.getAllPosts);
router.patch("/likepost/:postId", auth(), postController.likePost);
router.patch("/unlikepost/:postId", auth(), postController.unLikePost);
router.put("/updatepost/:postId", auth(), postController.updatePost);
router.delete("/deletepost/:postId", auth(), postController.deletePost);
router.post("/createcomment/:id", auth(), commentController.createComment);
router.put("/updatecomment/:id", auth(), commentController.updateComment);
router.delete("/deletecomment/:id", auth(), commentController.deleteComment);

export default router;
