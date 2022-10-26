const router = require('express').Router()
const {verifyToken} = require('../middleware/middleware')
const {fileUpload, getPosts, getPost} = require('../controller/post')
const upload = require('../config/storage')


router.get('/getpost', verifyToken, getPosts)


router.get('/getpost/:filename', getPost)


router.post('/upload', verifyToken, upload.single("file"), fileUpload)

module.exports = router