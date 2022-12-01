const { Chat } = require('../model/Chat')
const asyncHandler = require('express-async-handler')

const createChat = asyncHandler(async (req, res) => {
    const newChat = new Chat({
        members: [req.body.senderId, req.body.receiverId]
    })

    const response = await newChat.save()
    res.status(200).json(response)
})


const userChats = asyncHandler(async (req, res) => {
    const chat = await Chat.find({
        members: { $in: [req.params.userId] }
    })

    res.status(200).json(chat)
})


const findChat = asyncHandler(async (req, res) => {
    const chat = await Chat.findOne({
        members: { $all: [req.params.firstId, req.params.secondId] }
    })

    res.status(200).json(chat)
})

module.exports = {
    createChat,
    userChats,
    findChat
}