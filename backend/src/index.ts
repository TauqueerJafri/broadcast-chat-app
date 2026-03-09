import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";

const PORT = Number(process.env.PORT) || 8080;

interface User {
  socket: WebSocket;
  roomId: string;
}

const users: User[] = [];

// Simple HTTP server to handle health checks
const server = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  socket.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());

    switch (msg.type) {
      case "join": {
        users.push({ socket, roomId: msg.payload.roomId });
        console.log(`User joined room: ${msg.payload.roomId}`);
        break;
      }

      case "chat": {
        const senderRoom = users.find((u) => u.socket === socket)?.roomId;
        if (!senderRoom) return;

        const broadcast = JSON.stringify({
          name: msg.payload.name,
          message: msg.payload.message,
        });

        for (const user of users) {
          if (user.roomId === senderRoom) {
            user.socket.send(broadcast);
          }
        }
        break;
      }
    }
  });

  socket.on("close", () => {
    const index = users.findIndex((u) => u.socket === socket);
    if (index !== -1) users.splice(index, 1);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});