import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    title: String,
    description: String,
    is_checked: { type: Boolean, default: false },
    deadline: Date,
  },
  { timestamps: true }
);

const TodoModel = mongoose.model("Todo", todoSchema);

export default TodoModel;
