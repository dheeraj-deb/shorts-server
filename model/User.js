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
    maxLength: 10,
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
        return val.length > 6;
      },
      message: (props) => `${props.value} has to be grater than 6`,
    },
  },
  date_of_birth: {
    type: String,
    required: true,
  },
  followers: [mongoose.SchemaTypes.ObjectId],
  following: [mongoose.SchemaTypes.ObjectId],
  posts: [mongoose.SchemaTypes.ObjectId],
  date: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
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
    username: joi.string().min(3).max(8).label("Username"),
    email: joi.string().email().required().label("Email"),
    date_of_birth: joi.string().required().label("Date of birth"),
    password: joiPasswordComplexity().required().label("Password"),
  });

  return schema.validate(data);
};

module.exports = {User, validate}
