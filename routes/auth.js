const router = require("express").Router()
const {checkDuplicateUsernameOrEmail} =require('../middleware/middleware')
const {signUp, signIn, } = require('../controller/auth_controller')
const {} = require('../controller/posts_controler')


// @POST http://localhost:4000/shorts/auth/user/signup
router.post('/user/signup', checkDuplicateUsernameOrEmail, signUp)

// @POST http://localhost:4000/shorts/auth/user/signin
router.post('/user/signin', signIn)




module.exports = router;