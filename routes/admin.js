const router = require("express").Router();
const { fetchUser, blockAndUnblock, fetchPosts, removePost } = require("../controller/admin");
const { verifyAdmin } = require("../middleware/middleware");

// @GET http://localhost:4000/shorts/api/admin/user
// Access Private
router.get("/users", verifyAdmin, fetchUser);

// @PATCH http://localhost:4000/shorts/api/admin/blockuser
// Access Private
router.patch("/blockuser/:id", verifyAdmin, blockAndUnblock);

// @GET http://localhost:4000/shorts/api/admin/posts
// Access Private
router.get('/posts', verifyAdmin, fetchPosts)

// @PATCH http://localhost:4000/shorts/api/admin/remove-posts
// Access Private
router.get('/remove-post', verifyAdmin, removePost)



module.exports = router