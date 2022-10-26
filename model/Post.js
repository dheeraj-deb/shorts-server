const { required } = require("joi");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const replySchema = new Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  reply: {
    type: String,
    required: [true, "Reply is not found"],
  },
});

const commentsSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: true,
  },
  time: {
    type: Date,
    immutable: true,
    default: () => Date.now().toLocaleString(),
  },
  replys: [replySchema],
});

const postSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  user: {type:mongoose.SchemaTypes.ObjectId, ref:'User'},
  comments: [commentsSchema],
  time: {
    type: Date,
    immutable: true,
    default: () => Date.now().toLocaleString(),
  },
  postUri: {
    type: String,
    required: true,
  },
});
