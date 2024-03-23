const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const { sequelize } = require("./models");
const { chatsRouter } = require("./routes/chats.routes");
const server = http.createServer(app);

const io = new Server(server);
//TEST DEPLOY
io.on("connection", (socket) => {
    chatsRouter(io, socket);
});

//
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
