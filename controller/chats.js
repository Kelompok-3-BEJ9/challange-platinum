const { getUserFromToken } = require("../middleware/verifyAccess");
const { Op } = require("sequelize");
const { sequelize } = require("../models");
const { Rooms, Conversations, Messages, Users } = require("../models");
const { SuccessResponse } = require("../utils/respons");

const sendMessage = (io, socket) => async (message) => {
  const user = getUserFromToken(socket.handshake.headers.authorization);
  const text = message;
  
  const admin = await Users.findOne({
    where: {
      is_admin: true,
    },
  });
  const to_user_id  = socket.handshake.query.to_user_id || admin.id;

  let room = await sequelize.query(
    `select c.room_id from "Conversations" c 
        where c.user_id = :myuserid or c.user_id = :otheruser
        group by c.room_id 
        having count(c.room_id) = 2 `,
    {
      replacements: { myuserid: user.id, otheruser: to_user_id },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  if (room.length === 0) {
    const newRoom = await Rooms.create();

    room.push(newRoom);

    await Conversations.create({
      room_id: newRoom.id,
      user_id: user.id,
    });
    await Conversations.create({
      room_id: newRoom.id,
      user_id: to_user_id,
    });
  }

  const conversation = await Conversations.findOne({
    where: {
      room_id: room[0].room_id,
      user_id: user.id,
    },
    attributes: ["id"],
  })

  await Messages.create({
    conversation_id: conversation.id,
    user_id: user.id,
    message: text,
  });

  socket.join(room[0].room_id);
  io.to(room[0].room_id).emit("receiveMessage", text);

  socket.on('disconnect', async () => {
  io.to(room[0].room_id).emit("leftRoom", `${user.name} left`);
  });
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

module.exports = { sendMessage, showMessage };
