const asyncHandler = require("express-async-handler");
const { User } = require("../model/User");
const { Post } = require("../model/Post");
const cloudinary = require('../config/cloudinary')
const fs = require('fs')



const fileUpload = asyncHandler(async (req, res) => {
    const filePath = `/home/dheeraj/Videos/uploads/${req.file.filename}`
    const folder = '/home/dheeraj/Videos/uploads'
    cloudinary.uploader.upload(filePath, {
        resource_type: "video",
        folder: "video"
    },
        async (err, result) => {
            if (err) {
                return res.status(500).json({ message: err })
            }

            const upload = new Post({
                title: req.body.title,
                description: req.body.description,
                filename: req.file.originalname,
                postUri: result.url,
                cloudinary_id: result.public_id,
                postedBy: req.user.id
            })

            const post = await upload.save()

            await User.findByIdAndUpdate({ _id: req.user.id }, {
                $push: {
                    posts: post._id
                }
            })

            fs.unlinkSync(filePath)

            res.status(201).json({
                message: "success",
                post: post
            })
        })

})



const getPosts = asyncHandler(async (req, res) => {
    // const posts = await Post.find()
    // console.log(posts)


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


    if (!response?.length > 0) {
        return res.status(204).json({
            message: "No posts found!"
        })
    }


    console.log(response)

    res.status(200).json({
        message: "success",
        posts: response
    })

});


const likeandDislike = asyncHandler(async (req, res) => {
    const userId = req.body._id
    const postId = req.params.postId


    const post = await Post.findById(postId)

    // console.log(post)
    if (!post.likes.includes(userId)) {
        const response = await post.updateOne({ $push: { likes: userId } })
        console.log("res", response)
        res.status(200).json({ message: "Liked", postId: post._id, userId: userId })
    } else {
        const response = await post.updateOne({ $pull: { likes: userId } })
        res.status(200).json({ message: "Disliked", postId: post._id, userId: userId })
    }
})


const addComment = (req, res) => {
    const userId = req.body._id
    const postId = req.params.postId


    
}



module.exports = {
    fileUpload,
    getPosts,
    likeandDislike
};
