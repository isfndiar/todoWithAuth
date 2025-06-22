import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 24,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      min: 6,
      maxLength: 255,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser; // Password is required only if not a Google user
      },
    },
    googleId: {
      type: String,
      sparse: true,
    },
    picture: {
      type: String,
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
