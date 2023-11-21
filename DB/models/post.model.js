import { Schema, model, Types } from "mongoose";

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    caption: { type: String, required: true },
    images: { type: Array, required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Types.ObjectId, ref: "User" }],
    unLike: [{ type: Types.ObjectId, ref: "User" }],
    commentIds: [{ type: Types.ObjectId, ref: "Comment" }],
    totalCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.post("findOneAndUpdate", async function () {
  // console.log(this.model);
  // console.log(this.getQuery()._id);

  const docToUpdate = await this.model.findOne({ _id: this.getQuery()._id });
  // console.log(docToUpdate);
  // console.log(docToUpdate.likes.length);
  // console.log(docToUpdate.unLike.length);

  docToUpdate.totalCount = docToUpdate.likes.length - docToUpdate.unLike.length;
  // console.log(docToUpdate.totalCount);
  docToUpdate.save();
});
export const postModel = model("Post", postSchema);
