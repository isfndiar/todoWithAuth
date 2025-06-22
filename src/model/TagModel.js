import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  name: { type: String, unique: true, trim: true },
});

const TagModel = mongoose.model("Tag", tagSchema);

export default TagModel;
