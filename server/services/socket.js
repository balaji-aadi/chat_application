import { Server } from "socket.io";
import { Redis } from "ioredis";

const pub = new Redis({
  host: "caching-2a45750e-balajiaade2000-6af0.i.aivencloud.com",
  port: 10231,
  username: "default",
  password: "AVNS_BVnT6Mqj8-oXIHPBHAv",
});

const sub = new Redis({
  host: "caching-2a45750e-balajiaade2000-6af0.i.aivencloud.com",
  port: 10231,
  username: "default",
  password: "AVNS_BVnT6Mqj8-oXIHPBHAv",
});

class SocketService {
  constructor() {
    console.log("Init socket server...");
    const io = new Server({
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    this._io = io;
    sub.subscribe("MESSAGES");
  }

  initListeners() {
    const io = this.io;
    
    console.log("Init socket listeners...");

    io.on("connect", (socket) => {
      console.log(`New socket connected ${socket.id}`);

      socket.on("event:message", async ({ room, message }) => {

        console.log(`New message received in server side ${message}`);

        // publish this message to redis
        await pub.publish("MESSAGES", JSON.stringify({ room, message }));
      });
    });

    sub.on("message", (channel, message) => {
        if (channel === "MESSAGES") {

        const { room, message: msg } = JSON.parse(message);

          io.to(room).emit("message", msg);
        }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
