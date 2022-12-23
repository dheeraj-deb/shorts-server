const asyncHandler = require("express-async-handler");
const fs = require("fs");
const { User } = require("../model/User");
const { Post } = require("../model/Post");
const { default: mongoose } = require("mongoose");
const { Chat } = require("../model/Chat");
const { s3Bucket } = require("../config/s3");
const { Notification } = require("../model/Notification");

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

    const userId = req.user.id

    const response = await User.findByIdAndUpdate(userId, {
        $set: {
            username,
            bio,
            profileUri: req.file.filename
        }
    })

    if (response) {
        res.status(200).json(response)
    } else {
        res.status(400).json({
            message: "Something went wrong!"
        })
    }
})


const suggestUsers = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const user = await User.find({
        _id: {
            $ne: userId
        }
    }).limit(10).select("-password")

    const suggestion = user.filter((user) => {
        return !user.followers?.includes(userId)
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
    const user = await User.findById(mongoose.Types.ObjectId(id)).select('-password')
    res.status(200).json(user)
})


const fetchFollowers = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const user = await User.findById(userId).populate("followers", '-password').select("-password")

    if (user.followers) {
        console.log(user.followers);
        res.status(200).json(user.followers)
    } else {
        res.status(400).json([])
    }
})

const fetchFollowing = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const user = await User.findById(mongoose.Types.ObjectId(userId)).populate("following", '-password').select("-password")

    if (user.following) {
        console.log(user.following);
        res.status(200).json(user.following)
    } else {
        res.status(400).json([])
    }
})

const createNotification = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { secondUserId } = req.params;
    console.log(secondUserId);
    const existing = await Notification.find({ userOne: userId })

    // if (!existing.userTwo.includes(secondUserId)) {
    const response = await Notification.create({
        userOne: userId,
        userTwo: secondUserId
    })
    if (!response) return res.status(400).json("Something went wrong!")
    res.status(200).json("Notification Created")
    // }
})


const fetchNotifications = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const response = await Notification.find({
        userTwo: userId
    })

    if (!response) return res.status(400).json({ message: "No notifications" })
    res.status(200).json(response)
})

module.exports = {
    findUserPosts,
    editProfile,
    suggestUsers,
    followAndUnfollow,
    findUserById,
    fetchFollowers,
    fetchFollowing,
    createNotification,
    fetchNotifications
}