const router = require('express').Router()
const { createChat, userChats, findChat } = require('../controller/chat')
const { verifyToken } = require('../middleware/middleware')



router.post('/', verifyToken, createChat)
router.get('/:userId', verifyToken, userChats)
router.get("/find/:firstId:/:secondId", verifyToken, findChat)


module.exports = router