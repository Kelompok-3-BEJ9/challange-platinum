const { getUserFromToken } = require("../middleware/verifyAccess");
const { Op } = require("sequelize");
const { sequelize } = require("../models");
const { Rooms, Conversations, Messages, Users } = require("../models");
const { SuccessResponse } = require("../utils/respons");

const sendMessage = (io, socket) => async (message) => {
    const user = getUserFromToken(socket.handshake.headers.authorization);
    const text = message;

    //Handshake salah satu nya harus admin = true
    const admin = await Users.findOne({
        where: {
            is_admin: true,
        },
    });
    const to_user_id = socket.handshake.query.to_user_id || admin.id;

    // Periksa apakah to_user_id ada dalam database
    const recipient = await Users.findOne({
        where: {
            id: to_user_id,
        },
    });

    if (!recipient) {
        socket.emit("errorMessage", "User not found");
        return;
    }

    let room = await sequelize.query(
        `SELECT c.room_id FROM "Conversations" c 
        WHERE c.user_id = :myuserid OR c.user_id = :otheruser
        GROUP BY c.room_id 
        HAVING COUNT(c.room_id) = 2 `,
        {
            replacements: { myuserid: user.id, otheruser: to_user_id },
            type: sequelize.QueryTypes.SELECT,
        }
    );

    let roomId = room.length > 0 ? room[0].room_id : null;

    if (!roomId) {
        const newRoom = await Rooms.create();

        roomId = newRoom.id;

        await Conversations.bulkCreate([
            { room_id: newRoom.id, user_id: user.id },
            { room_id: newRoom.id, user_id: to_user_id },
        ]);

        // Percakapan Baru , otomatis akan dikirimkan chat welcome to the chat
        const welcomeMessage = `Welcome to the chat, ${user.name}!`;
        const newConversation = await Conversations.findOne({
            where: {
                room_id: roomId,
                user_id: user.id, // user penerima pesan selamat datang
            },
            attributes: ["id"],
        });

        if (newConversation) {
            await Messages.create({
                conversation_id: newConversation.id,
                user_id: admin.id, // Kirim dari admin
                message: welcomeMessage,
            });

            socket.join(roomId);
            io.to(roomId).emit("receiveMessage", welcomeMessage);
        }
    }

    const conversation = await Conversations.findOne({
        where: {
            room_id: roomId,
            user_id: user.id,
        },
        attributes: ["id"],
    });

    if (conversation) {
        await Messages.create({
            conversation_id: conversation.id,
            user_id: user.id,
            message: text,
        });

        socket.join(roomId);
        io.to(roomId).emit("receiveMessage", text);

        socket.on("disconnect", async () => {
            io.to(roomId).emit("leftRoom", `${user.name} left`);
        });
    }
};

const showMessage = async (req, res, next) => {
    try {
        const { room_id } = req.query;

        const conversations = await Conversations.findAll({
            where: {
                room_id,
            },
            attributes: ["id"],
        });

        const conversationId = conversations.map((conv) => conv.id);

        const messages = await Messages.findAll({
            where: {
                conversation_id: {
                    [Op.in]: conversationId,
                },
            },
            attributes: ["message", "user_id", "id"],
        });

        return res.status(200).json(new SuccessResponse("Success", 200, messages));
    } catch (error) {
        next(error);
    }
};

module.exports = { sendMessage, showMessage };
