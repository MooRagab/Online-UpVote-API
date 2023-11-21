import { commentModel } from "../../../../DB/models/comment.model.js";
import { postModel } from "../../../../DB/models/post.model.js";

export const createComment = async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  const post = await postModel.findById(id);
  if (!post) {
    res.status(404).json({ message: " Post Not Found" });
  } else {
    const comment = await commentModel.create({ text, userId: req.user._id });
    await postModel.updateOne(
      { _id: id },
      { $push: { commentIds: comment._id } }
    );
    res.status(201).json({ message: "Done To Added Comment" });
  }
};

export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const comment = await commentModel.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { text }
  );
  if (!comment) {
    res.status(404).json({ message: "Comment Not Found" });
  } else {
    res.status(201).json({ message: "Done" });
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const comment = await commentModel.findOneAndDelete({
    _id: id,
    userId: req.user._id,
  });
  if (!comment) {
    res.status(404).json({ message: "Comment Not Found" });
  } else {
    res.status(201).json({ message: "Done" });
  }
};
