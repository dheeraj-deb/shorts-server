const jwt = require("jsonwebtoken");
const { User } = require("../model/User");

exports.checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const isUsernameExist = await User.findOne({ username: username });

    if (isUsernameExist) {
      res.status(400).json({ message: "Failed! username is already in use" });
      return;
    }

    const isEmailExist = await User.findOne({ email });

    if (isEmailExist) {
      res.status(400).json({ message: "Failed! email is already in use" });
      return;
    }
    next();
  } catch (error) {
    throw new Error(error);
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Access token not found on" });
    jwt.verify(token, process.env.JWT_TOKEN, (err, data) => {
      if (err) {
        return res.status(401).json({ message: err.message });
      }
      next();
    });
  } catch (error) {
    next(new Error(error));
  }
};
