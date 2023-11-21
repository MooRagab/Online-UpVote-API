import { postModel } from "../../../../DB/models/post.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { paginate } from "../../../services/pagination.js";

export const createPost = async (req, res) => {
  if (!req.files) {
    res.status(400).json({ message: "image required" });
  } else {
    const { title, caption } = req.body;
    const images = [];

    for (const file of req.files) {
      const { secure_url } = await cloudinary.uploader.upload(file.path, {
        folder: `gallery/${req.user._id}/post`,
      });
      images.push(secure_url);
    }
    const post = await postModel.create({
      title,
      caption,
      userId: req.user._id,
      images,
    });
    res.status(201).json({ message: "Post added successfully" });
  }
};

export const getAllPosts = async (req, res) => {
  const { page, size } = req.query;
  const { skip, limit } = paginate(page, size);
  const post = await postModel
    .find({})
    .limit(limit)
    .skip(skip)
    .populate([
      {
        path: "commentIds",
      },
    ])
    .populate([{ path: "userId", select: "userName email profilePic" }]);
  res.status(200).json({ message: "This Is All Posts", post });
};

export const likePost = async (req, res) => {
  const { postId } = req.params;
  const post = await postModel.findOneAndUpdate(
    { _id: postId, likes: { $nin: req.user._id } },
    {
      $push: { likes: req.user._id },
      $pull: { unLike: req.user._id },
      $inc: { totalCount: 1 },
    },
    {
      new: true,
    }
  );
  res.json({ message: "Done", post });
};

export const unLikePost = async (req, res) => {
  const { postId } = req.params;
  const post = await postModel.findOneAndUpdate(
    { _id: postId, unLike: { $nin: req.user._id } },
    {
      $addToSet: { unLike: req.user._id },
      $pull: { likes: req.user._id },
      $inc: { totalCount: -1 },
    }
  );
  res.json({ message: "Done", post });
};

export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, caption } = req.body;

  const post = await postModel.findOne({ _id: postId, userId: req.user._id });
  if (!post) {
    res.status(404).json({ message: "Cant Find This Post" });
  } else {
    await postModel.updateOne({ title, caption });
    res.status(200).json({ message: "Updated Successfully" });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;

  const post = await postModel.findOneAndDelete({
    _id: postId,
    userId: req.user._id,
  });
  if (!post) {
    res.status(404).json({ message: "Cant Find This Post" });
  } else {
    res.status(200).json({ message: "Delted Successfully" });
  }
};
