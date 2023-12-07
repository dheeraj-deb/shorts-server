const asyncHandler = require("express-async-handler");
const { User } = require("../model/User");
const { Post } = require("../model/Post");
const { Comment } = require('../model/Comments')
const fs = require('fs');
const { default: mongoose } = require("mongoose");


const fileUpload = asyncHandler(async (req, res) => {
    const { file, body } = req
    const userId = req.user.id

    const response = await Post.create({
        title: req.body.title,
        description: body.description,
        filename: file.filename,
        postedBy: req.user.id,
        postUri: file.path,
        size: file.size
    })

    await User.findOneAndUpdate(userId, {
        $push: {
            posts: response._id
        }
    })

    res.status(201).json({
        message: "success",
        response
    })
})



const stream = asyncHandler(async (req, res) => {
    const videoId = req.params.postId;
    const video = await Post.findById(videoId);

    const path = video.postUri;
    const videoState = fs.statSync(path);
    const size = videoState.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt[parts[1], 10] : size - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(path, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        };

        res.writeHead(206, head);
        file.pipe(res);

    } else {
        const head = {
            'Content-Length': size,
            'Content-Type': 'video/mp4'
        };

        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }

});


const getPosts = asyncHandler(async (req, res) => {
    const response = await Post.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'postedBy',
                foreignField: '_id',
                as: 'user'
            }
        }
    ])



    if (response.length) {
        return res.status(200).json({
            message: "success",
            posts: response
        })
    }

    return res.status(204).json({
        message: "No posts found!"
    })


});



const findPostById = asyncHandler(async (req, res) => {
    const { postId } = req.params

    const post = await Post.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(postId) }
        },
        {
            $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        }
    ])

    if (post) {
        res.status(200).json(post[0])
    } else {
        res.status(400).json({ message: "No Posts found!" })
    }

})


const savePost = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const id = req.user.id


    const user = await User.findById(id)
    console.log(user);
    if (user.savedPost.includes(postId)) {
        user.savedPost.pull(mongoose.Types.ObjectId(postId))
        await user.save()
    } else {
        user.savedPost.push(mongoose.Types.ObjectId(postId))
        await user.save()
    }


    if (response) {
        res.status(200).json(response)
    } else {
        res.status(400).json({ message: "Something went wrong!" })
    }

})


const getSavedPost = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const response = await User.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(userId) } },
        {
            $unwind: "$savedPost"
        },
        {
            $lookup: {
                from: "posts",
                localField: "savedPost",
                foreignField: "_id",
                as: "saved"
            }
        },
        {
            $unwind: "$saved"
        }
    ])

    if (response) {
        res.status(200).json(response)
    } else {
        res.status(400).json({ message: "Something went wrong!" })
    }
})

const deletePost = asyncHandler(async (req, res) => {

    const postId = req.params.postId
    const userId = req.user.id

    const post = await Post.findOneAndRemove({ _id: postId })
    fs.unlinkSync(post.postUri)

    const user = await User.findById(userId)

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
})


const editPost = asyncHandler(async (req, res) => {
    const postId = req.params.postId
    const { title, description } = req.body
    const response = await Post.findByIdAndUpdate(postId, {
        $set: {
            title,
            description
        }
    })

    console.log(req.body);

    res.status(200).json({
        message: "post updated successfully"
    })
})


const likeAndDislike = asyncHandler(async (req, res) => {
    const userId = req.body._id
    const postId = req.params.postId

    const post = await Post.findById(postId)

    if (!post.likes.includes(userId)) {
        const response = await post.updateOne({ $push: { likes: userId } })
        res.status(200).json({ message: "Liked", postId: post._id, userId: userId })
    } else {
        const response = await post.updateOne({ $pull: { likes: userId } })
        res.status(200).json({ message: "Disliked", postId: post._id, userId: userId })
    }
})



const getComments = asyncHandler(async (req, res) => {
    const postId = req.params.postId

    const comments = await Comment.find({
        postId
    })

    if (comments.length) {
        res.status(200).json({
            comments
        })
    } else {
        res.status(200).json({
            message: "No comments found for this post!",
        })
    }
})


const addComment = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const postId = req.params.postId

    const inputs = req.body.comments;

    const comments = new Comment({
        ...inputs
    })

    const comment = await comments.save()

    const response = await Post.findByIdAndUpdate(postId, {
        $push: {
            comments: comment._id
        }
    })

    const user = await User.findById(userId)

    if (!user.commentedPosts.includes(response._id)) {
        console.log("here");
        user.commentedPosts.push(response._id)
        await user.save()
    }


    res.status(201).json({
        message: "comment added successfully",
        comment
    })

})


const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const response = await Comment.findOneAndDelete({
        commentId
    })
    if (response) {
        res.status(200).json({ response })
    } else {
        res.status(400).json({ message: "Something went wrong" })
    }

})


const likeAndDislikeComment = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const { commentId } = req.params

    const comment = await Comment.findOne({ commentId })

    if (!comment.likes.includes(userId)) {
        const response = await comment.updateOne({ $push: { likes: userId } })
        res.status(200).json({ message: "Liked", commentId: comment.commentId, userId })
    } else {
        const response = await comment.updateOne({ $pull: { likes: userId } })
        res.status(200).json({ message: "Disliked", commentId: comment.commentId, userId })
    }
})

const replyToComment = asyncHandler(async (req, res) => {
    const postId = req.params.postId
    const { repliedToCommentId } = req.body

    const response = await Post.updateOne({ _id: postId }, {
        $push: {

        }
    })

    console.log("res", response);
})


module.exports = {
    fileUpload,
    stream,
    getPosts,
    findPostById,
    likeAndDislike,
    deletePost,
    editPost,
    addComment,
    replyToComment,
    getComments,
    deleteComment,
    likeAndDislikeComment,
    savePost,
    getSavedPost
};
