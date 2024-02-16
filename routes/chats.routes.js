const { chooseRoom } = require("../controller/chats")

const chatsRouter = (io,socket) => {
    socket.on('chooseRoom', chooseRoom(io, socket))
}

module.exports = chatsRouter ;