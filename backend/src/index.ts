import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
}

let allSockets: User[] = [];

wss.on('connection', (socket) => {
    socket.on('message', (message) => {
        const parsedMessage = JSON.parse(message as unknown as string);
        if (parsedMessage.type === "join") {
            console.log(`User joined room: ${parsedMessage.payload.roomId}`);
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }

        if (parsedMessage.type === "chat") {
            console.log(`User sent message: ${parsedMessage.payload.message}`);
            // Find the room of the current user.
            const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room;

            // Broadcast the message to all users in the same room.
            allSockets.forEach((user) => {
                if (user.room === currentUserRoom) {
                    user.socket.send(parsedMessage.payload.message)
                }
            });
        }
    });
});