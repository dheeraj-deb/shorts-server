const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const joi = require("joi");
const joiPasswordComplexity = require("joi-password-complexity");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        let val = v.split("");
        return val.length >= 6;
      },
      message: (props) => `${props.value} has to be grater than 6`,
    },
  },
  age: {
    type: String,
    required: true,
  },
  followers: {
    type: Array,
    ref: "User"
  },
  following: {
    type: Array,
    ref: "User"
  },
  posts: [mongoose.SchemaTypes.ObjectId],
  isBlocked: {
    type: Boolean,
    default: false,
  },
  resetLink: {
    type: String,
    default: "",
  },
  bio: {
    type: String
  },
  commentedPosts: {
    type: Array,
  },
  savedPost: {
    type: Array
  }
}, {
  timestamps: true
});

userSchema.pre("validate", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    throw new Error("hashing failed");
  }
});

const User = mongoose.model("User", userSchema);

const validate = (data) => {
  const schema = joi.object({
    username: joi.string().min(3).max(30).label("Username"),
    email: joi.string().email().required().label("Email"),
    age: joi.string().required().label("age"),
    password: joi.string().required().label("Password"),
  });

  return schema.validate(data);
};

module.exports = { User, validate };
