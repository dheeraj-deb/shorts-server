const jwt = require("jsonwebtoken");
const { User } = require("../model/User");
const asyncHandler = require("express-async-handler");

exports.checkDuplicateUsernameOrEmail = asyncHandler(async (req, res, next) => {
  const { username, email } = req.body;

  const isUsernameExist = await User.findOne({ username: username }).select('-password')

  if (isUsernameExist) {
    res.status(400)
    throw new Error("Username is already in use")
  }

  const isEmailExist = await User.findOne({ email }).select('-password')

  if (isEmailExist) {
    res.status(400)
    throw new Error("Email is already in use")
  }

  next();

});

exports.verifyToken = asyncHandler(async (req, res, next) => {
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1]
    const response = await jwt.verify(token, process.env.JWT_TOKEN)
    if (response) {
      req.user = response
      next()
    }
  } else {
    res.status(401)
    throw new Error("Access token not found on headers")
  }
});


exports.verifyAdmin = asyncHandler(async (req, res, next) => {
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1]
    const response = await jwt.verify(token, process.env.JWT_ADMIN_TOKEN)
    if (response) {
      next()
    }
  } else {
    res.status(401)
    throw new Error("Access token not found on headers")
  }
})
