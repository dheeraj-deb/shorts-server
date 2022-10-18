const router = require('express').Router()
const {getPost} = require('../controller/posts_controler')
const {verifyToken} = require('../middleware/middleware')


router.get('/getpost', verifyToken, getPost)

module.exports = router