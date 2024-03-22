const { createOrder, orderSuccess, getOrderDetails } = require("../controller/order");
const { authenticate, authorization } = require("../middleware/verifyAccess");

const router = require("express").Router();

router
    .post("/order/v1", authenticate, createOrder)
    .put("/update/order/v1", authenticate, authorization, orderSuccess)
    .get("/get/order/v1", authenticate, getOrderDetails);

module.exports = router;
