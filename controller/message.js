const { Message } = require('../model/Message')
const asyncHandler = require('express-async-handler')


const addMessage = asyncHandler(async (req, res) => {
    const { chatId, senderId, text } = req.body
    const message = new Message({
        chatId,
        senderId,
        text
    })

    const response = await message.save()
    res.status(201).json(response)
})


const getMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params

    const response = await Message.find({ chatId })
    res.status(200).json(response)
})

module.exports = {
    addMessage,
    getMessages
}