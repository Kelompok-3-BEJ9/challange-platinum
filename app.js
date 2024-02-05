const express = require("express");
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express')
const swaggerJson = require('./swagger.json')
const userRouter = require("./routes/user.routes");
const itemRouter = require("./routes/item.routes");
const orderRouter = require("./routes/order.routes");

const app = express();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));
app.use(express.json());
app.use(morgan('dev'));

//swagger documentation

app.get("/", (req, res) => {
  return res.status(200).json("Ready");
});


app.use(userRouter);
app.use(itemRouter);
app.use(orderRouter);


//! errror handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status:500,
    error: err.message,
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: "METHODE AND ENDPOINT NOT FOUND!",
  });
});

module.exports = app;
