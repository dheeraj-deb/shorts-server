const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, validate } = require("../model/User");


const signUp = async (req, res, next) => {
  console.log(req.body)
  try {
    const { username, email, date_of_birth, password } = req.body;

    const { error } = validate(req.body);

    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const user = await User.create({
      username,
      email,
      date_of_birth,
      password,
    });

    if (user) {
      res.status(201).json({ message: "User created successfully" });
    } else {
    }
  } catch (error) {
    next(new Error(error));
  }
};

const signIn = async (req, res, next) => {
  console.log(req.body)
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({
        message: "User not found!",
      });
      return;
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      res.status(401).status({
        accessToken: null,
        message: "Invalid password!",
      });
      return;
    }

    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: 86400,
      }
    );

    res.status(200).json({
      username: user.username,
      email: user.email,
      accessToken: token,
    });
    
  } catch (error) {
    next(new Error(error));
  }
};

module.exports = {
  signUp,
  signIn,
};
