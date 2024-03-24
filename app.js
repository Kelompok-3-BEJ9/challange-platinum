const express = require("express");
const morgan = require("morgan");
const swagger = require("./docs/swager");
const userRouter = require("./routes/user.routes");
const itemRouter = require("./routes/item.routes");
const orderRouter = require("./routes/order.routes");
const { chatRouterRestAPI } = require("./routes/chats.routes");
const passport = require("passport");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

//API documentation
app.use(swagger);

app.get("/", (req, res) => {
    return res.status(200).json("Ready");
});

app.use(passport.initialize()); // ini passport
app.use(chatRouterRestAPI); //chat rest api
app.use(userRouter);
app.use(itemRouter);
app.use(orderRouter);

//! errror handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        status: 500,
        error: "Internal Server Error",
    });
});

app.use((req, res) => {
    res.status(404).json({
        status: 404,
        error: "METHODE AND ENDPOINT NOT FOUND!",
    });
});

module.exports = app;
