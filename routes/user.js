const router = require('express').Router()
const { verifyToken } = require('../middleware/middleware')
const { fileUpload, getPosts, likeAndDislike, stream, deletePost, addComment, replyToComment, getComments, deleteComment, likeAndDislikeComment, editPost, findPostById, savePost, getSavedPost } = require('../controller/post')
const { findUserPosts, suggestUsers, followAndUnfollow, findUserById, editProfile, fetchFollowers, fetchFollowing } = require('../controller/user')
const upload = require('../config/multer')
const { uploadImage, uploadVideo } = require('../config/multer')


// post
router.post('/upload', verifyToken, uploadVideo.single('video'), fileUpload)

router.get('/getposts', getPosts)

router.get('/post/:postId', findPostById)

router.patch('/like/:postId', verifyToken, likeAndDislike)

router.get('/stream/:postId', stream)

router.delete('/:postId', verifyToken, deletePost)

router.patch('/edit/:postId', verifyToken, editPost)

router.post('/save/:postId', verifyToken, savePost)

router.get('/saved-post', verifyToken, getSavedPost)


// comment
router.post('/add_comment/:postId', verifyToken, addComment)

router.patch('/comment/reply/:postId', verifyToken, replyToComment)

router.get('/comments/:postId', getComments)

router.delete('/comment/:commentId', verifyToken, deleteComment)

router.patch('/comment/like/:commentId', verifyToken, likeAndDislikeComment)


// user
router.get('/user/posts/:userId', verifyToken, findUserPosts)

router.get('/user/suggest', verifyToken, suggestUsers)

router.patch('/follow_unfollow/:followingId', verifyToken, followAndUnfollow)

router.get('/user/:id', verifyToken, findUserById)

router.post('/user/edit', verifyToken, uploadImage.single('profile'), editProfile)

router.get('/user/followers/:userId', verifyToken, fetchFollowers)

router.get('/user/following/:userId', verifyToken, fetchFollowing)

module.exports = router