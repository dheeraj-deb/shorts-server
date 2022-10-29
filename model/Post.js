const { required } = require("joi");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  likes: [],
  postedBy: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  comments: [],
  time: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  postUri: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
});

const Post = model("Post", postSchema);

module.exports = { Post };
