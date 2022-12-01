const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, validate } = require("../model/User");
const { Admin } = require("../model/Admin");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

const signUp = asyncHandler(async (req, res, next) => {
  console.log(req.body);

  const { username, email, age, password } = req.body;

  const { error } = validate(req.body);

  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const user = await User.create({
    username,
    email,
    age,
    password,
  });

  if (user) {
    res.status(201).json({ message: "User created successfully" });
  } else {
    res.status(500);
    throw new Error("Something went wrong!");
  }
});

const signIn = asyncHandler(async (req, res, next) => {
  console.log(req.body);

  const { username, password } = req.body;

  const user = await User.findOne({ username: username });

  if (!user) {
    res.status(401);
    throw new Error("User not found!");
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);

  console.log(passwordIsValid);

  if (!passwordIsValid) {
    res.status(401);
    throw new Error("Invalid password!");
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_TOKEN,
    {
      expiresIn: 86400,
    }
  );

  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    age: user.age,
    followers: user.followers,
    following: user.following,
    isBlocked: user.isBlocked,
    posts: user.posts,
    accessToken: token,
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select("-password");
  if (user) {
    const token = jwt.sign({ _id: user._id }, process.env.PASSWORD_RESET_KEY, {
      expiresIn: "10m",
    });

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    const data = {
      from: "test@helloworld.com",
      to: email,
      subject: "Reset password link",
      html: `
      <h3>please click the link below to reset your password </h3>
      <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
      `,
    };

    await user.updateOne({ resetLink: token });
    const emailRes = await transporter.sendMail(data);

    if (emailRes) {
      res.status(200).json({
        message: "Email has been sent",
      });
    }
  } else {
    res.status(404).json({
      message: "Can't find any user with the email",
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (token) {
    const decodeJwt = jwt.verify(token, process.env.PASSWORD_RESET_KEY);

    if (decodeJwt) {
      const user = await User.findOne({ resetLink: token }).select("-password");
      if (!user) {
        res
          .status(400)
          .json({ message: "user with this token does not exist" });
      }

      user.password = password;

      user.save((err, result) => {
        if (err) {
          return res.status(400).json({ message: "Reset password error" });
        } else {
          return res.status(200).json({ message: "Password reset success" });
        }
      });
    }
  } else {
    res.status(400).json({ message: "Token not found" });
  }
});

const adminSignin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin) {
    res.status(401).json({
      message: "Invalid credentials",
    });
  }
  const checkPassword = bcrypt.compareSync(password, admin.password);

  if (!checkPassword) {
    res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign({ email: admin.email }, process.env.JWT_ADMIN_TOKEN, {
    expiresIn: 86400,
  });

  res.status(200).json({
    accessToken: token,
    username: admin.username,
    email: admin.email,
  });
});

module.exports = {
  signUp,
  signIn,
  adminSignin,
  forgotPassword,
  resetPassword,
};
