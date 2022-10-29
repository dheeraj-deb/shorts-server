const router = require('express').Router()
const { verifyToken } = require('../middleware/middleware')
const { fileUpload, getPosts, likeandDislike } = require('../controller/post')
const upload = require('../config/multer')



router.post('/upload', verifyToken, upload.single('video'), fileUpload)

router.get('/getposts', getPosts)

router.patch('/like/:postId', verifyToken, likeandDislike)


module.exports = router