const router = require("express").Router();
const { fetchUser, blockAndUnblock, editUser } = require("../controller/admin");
const { verifyAdmin } = require("../middleware/middleware");

// @GET http://localhost:4000/shorts/api/admin/user
// Access Private
router.get("/users",  fetchUser);

// @PATCH http://localhost:4000/shorts/api/admin/blockuser
// Access Private
router.patch("/blockuser/:id", verifyAdmin, blockAndUnblock);


// @PATCH http://localhost:4000/shorts/api/admin/edituser
// Access Private
router.patch('/edituser', verifyAdmin, editUser)

module.exports = router