const asyncHandler = require("express-async-handler");
const fs = require("fs")
const { default: mongoose } = require("mongoose");
const { User } = require("../model/User");
const { Post } = require("../model/Post")

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


const fetchPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()

  if (posts.length) {
    return res.status(200).json(posts)
  } else {
    return res.status(400).json("No Posts Found!")
  }

})

const removePost = asyncHandler(async (req, res) => {
  const { postId } = req.params

  const post = await Post.findByIdAndDelete(postId)

  if (post) {
    fs.unlinkSync(post.postUri)
    const user = await User.findById(post.postedBy)

    if (user.posts.includes(post._id)) {
      user.posts.pull(post._id)
      if (user.commentedPosts.includes(post._id)) {
        user.commentedPosts.pull(post._id)
      }
      await user.save()
    }

    const response = await User.findByIdAndUpdate(userId, {
      $pull: { posts: post._id }
    })

    res.status(200).json({
      message: "post deleted successfully",
      postId: post._id
    })

  } else {
    res.status(400).json({ message: "Something went Wrong!" })
  }
})


module.exports = {
  fetchUser,
  blockAndUnblock,
  fetchPosts,
  removePost,

};
