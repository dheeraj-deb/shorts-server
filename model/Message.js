const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
    {
        chatId: {
            type: String,
        },
        senderId: {
            type: String,
        },
        text: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = { Message };
