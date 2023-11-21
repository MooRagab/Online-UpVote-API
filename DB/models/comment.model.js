import { Schema, model, Types } from "mongoose";

const commentSchema = new Schema(
  {
    text: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export const commentModel = model("Comment", commentSchema);
 