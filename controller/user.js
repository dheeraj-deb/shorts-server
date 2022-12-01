const asyncHandler = require("express-async-handler");
const fs = require("fs");
const { User } = require("../model/User");
const { Post } = require("../model/Post");
const { default: mongoose } = require("mongoose");
const { Chat } = require("../model/Chat");
const { s3Bucket } = require("../config/s3");

const findUserPosts = asyncHandler(async (req, res) => {
    const { userId } = req.params

    const posts = await User.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(userId) }
        },
        {
            $unwind: "$posts"
        },
        {
            $lookup: {
                from: 'posts',
                localField: 'posts',
                foreignField: '_id',
                as: 'post'
            }
        },
        {
            $unwind: "$post"
        }

    ])

    console.log("posts", posts);

    if (posts.length) {
        res.status(200).json({
            posts
        })
    } else {
        res.status(200).json({
            message: "No posts found!"
        })
    }
})

const editProfile = asyncHandler(async (req, res) => {
    const { username, bio, profile } = req.body

    console.log("REQQQQQ", username, bio, profile);

    // const userId = req.user.id


    // const response = await User.findByIdAndUpdate(userId, {
    //     $set: {
    //         username,
    //         bio
    //     }
    // })

    // if (response) {
    //     res.status(200).json({ message: "Profile updated successfully" })
    // } else {
    //     res.status(400).json({
    //         message: "Something went wrong!"
    //     })
    // }
})


const suggestUsers = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const user = await User.find({
        _id: {
            $ne: userId
        }
    }).limit(10).select("-password")

    const suggestion = user.filter((user) => {
        return (!user.followers.includes(userId))
    })

    res.status(200).json({
        message: "success",
        suggestion
    })

})


const followAndUnfollow = asyncHandler(async (req, res) => {
    const followingUserId = req.params.followingId
    const followerId = req.user.id

    const user = await User.findById(followerId)

    if (!user.following.includes(followingUserId)) {
        await User.findByIdAndUpdate(followerId, {
            $push: {
                following: followingUserId
            }
        })
        const response = await User.findByIdAndUpdate(followingUserId, {
            $push: {
                followers: followerId
            }
        })

        res.status(200).json({
            message: "Followed",
            userId: response._id
        })
    } else {
        await User.findByIdAndUpdate(followerId, {
            $pull: {
                following: followingUserId
            }
        })
        const response = await User.findByIdAndUpdate(followingUserId, {
            $pull: {
                followers: followerId
            }
        })
        res.status(200).json({
            message: "UnFollowed",
            userId: response._id
        })
    }



    let isUserExist;

    const chats = await Chat.find()

    chats.forEach((chat) => {
        if (chat.members.includes(followingUserId) && chat.members.includes(followerId)) {
            isUserExist = true
        } else {
            isUserExist = false
        }
    })

    if (isUserExist) return

    const newChat = new Chat({
        members: [followerId, followingUserId]
    })

    await newChat.save()
})



const findUserById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id).select('-password')
    res.status(200).json(user)
})

module.exports = {
    findUserPosts,
    editProfile,
    suggestUsers,
    followAndUnfollow,
    findUserById
}