const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const { User } = require("../model/User");

const fetchUser = asyncHandler(async (req, res) => {
  const user = await User.find().select("-password");

  if (user) {
    res.status(200).json({
      user,
    });
  } else {
    res.status(404);
    throw new Error("No users found!");
  }
});

const blockAndUnblock = asyncHandler(async (req, res) => {
  console.log(req.params.id);
  const id = req.params.id;
  const user = await User.findById({ _id: id }).select("-password");
  if (user) {
    if (user.isBlocked) {
      const response = await User.findByIdAndUpdate(
        { _id: user._id },
        {
          isBlocked: false,
        }
      );

      if (response) {
        res.status(200).json({
          message: "User unBlocked",
        });
      }
    } else {
      const response = await User.findByIdAndUpdate(
        { _id: user._id },
        {
          isBlocked: true,
        }
      );

      if (response) {
        res.status(200).json({
          message: "User blocked",
        });
      }
    }
  } else {
    res.status(404);
    throw new Error("There is no user by the given id");
  }
});

const editUser = asyncHandler(async (req, res) => {
  const { _id, username, email, age, date } = req.body;
  const response = await User.findByIdAndUpdate(
    { _id: _id },
    {
      username: username,
      email: email,
      age: age,
      date: date,
    }
  ).select("-password");

  if (!response) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }

  res.status(200).json({
    message: "success",
    res: response,
  });
});


// const editPost = asyncHandler(async (req, res) => {

// })

module.exports = {
  fetchUser,
  blockAndUnblock,
  editUser,
};
