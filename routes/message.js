const router = require('express').Router()
const { addMessage, getMessages } = require('../controller/message')
const { verifyToken } = require('../middleware/middleware')


router.post('/', verifyToken, addMessage)
router.get('/:chatId', verifyToken, getMessages)



module.exports = router