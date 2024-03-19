const { register, login, verifyEmail, updateAdmin } = require("../controller/auth");
const { getAll, update, deleted, updateDetail, getOne } = require("../controller/user");
const { authenticate, authorization } = require("../middleware/verifyAccess");

const router = require("express").Router();

router
    .post("/register/v1", register)
    .post("/login/v1", login)
    .put("/updateAdmin/v1", authenticate, updateAdmin)
    .get("/all/v1", authenticate, getAll)
    .get("/verify/v1", verifyEmail)
    .get("/user/v1/:id", authenticate, authorization, getOne)
    .put("/update/v1", authenticate, update)
    .put("/updateDetail/v1", authenticate, updateDetail)
    .delete("/delete/v1/:id", deleted);

module.exports = router;
