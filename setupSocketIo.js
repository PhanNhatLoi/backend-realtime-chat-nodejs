require("dotenv").config();
// const socket = require("socket.io");
const clientPromise = require("./lib/mongodb");
const { ObjectId } = require("mongodb");
const { Server } = require("socket.io");

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "https://chat-app-realtime-orcin.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

function setupSocketIo(server) {
  const io = new Server(server, {
    cors: corsOptions,
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
