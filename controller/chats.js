const { sequelize } = require("../models")
const { Rooms,Conversations } = require("../models");

const chooseRoom = (io, socket) =>
  async function (message) {
    const { user_id, other_user_id } = message;
    let room = await sequelize.query(
      `select c.room_id from "Conversations" c 
        where c.user_id = :myuserid or c.user_id = :otheruserid
        group by c.room_id 
        having count(c.room_id) = 2 `,
      {
        replacements: { myuserid: user_id, otheruserid: other_user_id },
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
        user_id: other_user_id,
      });
    }
    socket.join(room[0].room_id);
    io.to(room[0].room_id).emit('joinRoom', room[0].room_id)
  };

module.exports = { chooseRoom };