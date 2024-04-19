require("dotenv").config();
const socket = require("socket.io");
const clientPromise = require("./lib/mongodb");
const { ObjectId } = require("mongodb");

function setupSocketIo(server) {
  const io = socket(server, {
    cors: {
      origin: "https://chat-app-realtime-orcin.vercel.app",
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection("users");
    const messages = db.collection("messages");
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
      const fromIdUserObject = new ObjectId(data.from);
      const sendUserSocket = await collection.findOne({ _id: userIdObject });
      const fromUser = await collection.findOne({ _id: fromIdUserObject });
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
