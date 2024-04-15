const socket = require("socket.io");
const clientPromise = require("./lib/mongodb");
const { ObjectId } = require("mongodb");

function setupSocketIo(server) {
  const io = socket(server, {
    cors: {
      origin: `http://localhost:${3000}`,
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection("users");
    socket.on("online", async (userId) => {
      const userIdObject = new ObjectId(userId);
      await collection.updateOne(
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
      const sendUserSocket = await collection.findOne({ _id: userIdObject });
      if (sendUserSocket) {
        socket.to(sendUserSocket.socketId).emit("msg-recieve", data.msg);
      }
    });
  });
}

module.exports = setupSocketIo;
