const {
  createOrder,
  orderSuccess,
  getOrderDetails,
} = require("../controller/order");
const { verifyAccesToken } = require("../middleware/verifyAccess");

const router = require("express").Router();

router
  .post("/order/v1/:user_id", createOrder)
  .put("/update/order/v1", orderSuccess)
  .get("/get/order/v1", getOrderDetails);

module.exports = router;
