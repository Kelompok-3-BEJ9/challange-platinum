const { chooseRoom, sendMessage, showMessage } = require("../controller/chats");
const router = require("express").Router();

const chatsRouter = (io, socket) => {
  socket.on("chooseRoom", chooseRoom(io, socket));
  socket.on("sendMessage", sendMessage(io, socket));
};

router.get("/chat/message", showMessage);

module.exports = { chatsRouter, chatRouterRestAPI: router };
