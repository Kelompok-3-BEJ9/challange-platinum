const app = require('./app');
const http = require('http'); 
const { Server } = require('socket.io'); 
const { sequelize } = require("./models");
const chatsRouter = require('./routes/chats.routes');
const server = http.createServer(app);



const io = new Server(server)

io.on('connection', (socket) => {
  chatsRouter(io, socket)
  
  // const {room} = socket.handshake.query
  // if (socket.adapter.rooms.get(room)?.size < 2 || !socket.adapter.rooms.get(room)) {
  //   socket.join(room)
  // }else {
  //   socket.emit('receiveMessage', 'Room is full')
  //   socket.disconnect()
  // }

  // socket.on('sendMessage', (message) => {
  //   io.to(room).emit('receiveMessage', message)
  // })
})

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Connection to the database successful.");
    const PORT = process.env.PORT || 1990;
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
