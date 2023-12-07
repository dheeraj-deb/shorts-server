const mongoose = require('mongoose')


const CommentSchema = mongoose.Schema({

    commentedBy: {
        type: mongoose.Types.ObjectId
    },

    commentId: {
        type: Number
    },

    avatarUri: {    
        type: String
    },

    username: {
        type: String
    },

    text: {
        type: String
    },
    replies: {
        type: Array
    },
    postId: {
        type: mongoose.Types.ObjectId
    },
    likes: {
        type: Array
    },
    parent: {
        type: String
    },

}, {
    timestamps: true
})

const Comment = mongoose.model("Comment", CommentSchema)
module.exports = { Comment }