import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: Number,
    gender: { type: String, default: "male", enum: ["male", "female"] },
    confirmEmail: { type: Boolean, default: false },
    profilePic: String,
    coverPic: String,
    phone: String,
    code: { type: String, default: null },
    role: { type: String, default: "User" },
  },
  { timestamps: true }
);

// userSchema.pre("save", function () {
//   console.log(this);
//   this.password = bcrypt.hashSync(
//     this.password,
//     parseInt(process.env.SALTROUND)
//   );
// });

export const userModel = model("User", userSchema);
