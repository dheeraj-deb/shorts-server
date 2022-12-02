const router = require("express").Router();
const { fetchUser, blockAndUnblock } = require("../controller/admin");
const { verifyAdmin } = require("../middleware/middleware");

// @GET http://localhost:4000/shorts/api/admin/user
// Access Private
router.get("/users", fetchUser);

// @PATCH http://localhost:4000/shorts/api/admin/blockuser
// Access Private
router.patch("/blockuser/:id", verifyAdmin, blockAndUnblock);




module.exports = router