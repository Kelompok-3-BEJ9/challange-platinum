const { getUserFromToken } = require("../middleware/verifyAccess");
const { Op } = require("sequelize");
const { sequelize } = require("../models");
const { Rooms, Conversations, Messages } = require("../models");
const { ErrorResponse, SuccessResponse } = require("../utils/respons");

const chooseRoom = (io, socket) => async (message) => {
  const user_id = getUserFromToken(socket.handshake.headers.authorization);

  const { to_user_id } = socket.handshake.query;
  
  let room = await sequelize.query(
    `select c.room_id from "Conversations" c 
        where c.user_id = :myuserid or c.user_id = :otheruserid
        group by c.room_id 
        having count(c.room_id) = 2 `,
    {
      replacements: { myuserid: user_id, otheruserid: to_user_id },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  if (room.length === 0) {
    const newRoom = await Rooms.create();

    room.push(newRoom);

    await Conversations.create({
      room_id: newRoom.id,
      user_id: user_id,
    });
    await Conversations.create({
      room_id: newRoom.id,
      user_id: to_user_id,
    });
  }
  socket.join(room[0].room_id);
  io.to(room[0].room_id).emit("joinRoom", room[0].room_id);
};

const sendMessage = (io, socket) => async (message) => {
  const { room_id } = socket.handshake.query;
  const text = message;
  try {
    const user_id = getUserFromToken(socket.handshake.headers.authorization);
    const conversations = await Conversations.findOne({
      where: {
        room_id,
        user_id,
      },
      attributes: ["id"],
    });
    if (!conversations) {
      throw new ErrorResponse("Room Not Found", 404);
    }

    await Messages.create({
      conversation_id: conversations.id,
      user_id,
      message: text,
    });

    const data = {
      user_id,
      room_id,
      message: text,
    };

    socket.join(room_id);
    io.to(room_id).emit(
      "receiveMessage",
      data.message,
    );
  } catch (error) {
    socket.join(room_id);
    io.to(socket.id).emit("receiveMessage", error);
  }
};

const showMessage = async (req, res, next) => {
  try {
    // const id  = getUserFromToken(req.headers.authorization);
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

module.exports = { chooseRoom, sendMessage, showMessage };
