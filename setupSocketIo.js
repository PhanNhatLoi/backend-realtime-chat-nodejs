require("dotenv").config();
const clientPromise = require("./lib/mongodb");
const { ObjectId } = require("mongodb");
const { Server } = require("socket.io");

function setupSocketIo(server) {
  const io = new Server(server, {
    cors: "*",
  });

  io.on("connection", async (socket) => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const users = db.collection("users");
    const messages = db.collection("messages");
    socket.on("online", async (userId) => {
      const userIdObject = new ObjectId(userId);
      await users.updateOne(
        { _id: userIdObject },
        {
          $set: {
            socketId: socket.id,
          },
        }
      );
    });

    socket.on("send-msg", async (data) => {
      const userIdObject = new ObjectId(data.to);
      const fromIdUserObject = new ObjectId(data.from);
      const sendUserSocket = await users.findOne({ _id: userIdObject });
      const fromUser = await users.findOne({ _id: fromIdUserObject });
      if (sendUserSocket) {
        socket.to(sendUserSocket.socketId).emit("msg-recieve", data, fromUser);
      }
    });
    socket.on("read-msg", async (_id) => {
      const userIdObject = new ObjectId(_id);
      await messages.updateMany(
        { from: userIdObject, status: "sent" },
        { $set: { status: "seen" } }
      );
    });
  });
}

module.exports = setupSocketIo;
