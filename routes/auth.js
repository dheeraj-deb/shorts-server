const router = require("express").Router()
const {checkDuplicateUsernameOrEmail} =require('../middleware/middleware')
const {signUp, signIn, forgotPassword} = require('../controller/auth_controller')
const {adminSignin} = require('../controller/auth_controller')
const {verifyToken} = require('../middleware/middleware')


// User Authentication
//--------------------

// @POST http://localhost:4000/shorts/api/auth/user/signup

router.post('/user/signup', checkDuplicateUsernameOrEmail, signUp)

// @POST http://localhost:4000/shorts/api/auth/user/signin

router.post('/user/signin', signIn)

// @POST http://localhost:4000/shorts/api/auth/user/forgot_password

router.post('/user/forgot_password', verifyToken, forgotPassword)

// ----------------------------------------------------------------

// Admin Authentication

// @POST http://localhost:4000/shorts/api/auth/admin/signin

router.post('/admin/signin', adminSignin)




module.exports = router;