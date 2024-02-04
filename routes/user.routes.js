const { register, login, verifyEmail } = require("../controller/auth");
const { getAll, update, deleted, updateDetail, getOne } = require("../controller/user");
const { verifyAccesToken } = require("../middleware/verifyAccess");

const router = require("express").Router();

router
  .post("/register/v1", register)
  .post("/login/v1", login)
  .get("/all/v1", getAll)
  .get("/verify/v1", verifyEmail)
  .get("/user/v1/:id", getOne)
  .put("/update/v1/:id", update)
  .put("/updateDetail/v1/:user_id", updateDetail)
  .delete("/delete/v1/:id", deleted);

module.exports = router;
