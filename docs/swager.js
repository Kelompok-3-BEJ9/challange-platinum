const swaggerUi = require("swagger-ui-express");
const swaggerJson = require("./swagger.json");
const router = require("express").Router();

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

module.exports = router;
