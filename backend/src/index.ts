import { WebSocketServer, WebSocket } from "ws";

const PORT = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ port: PORT });

interface User {
    socket: WebSocket;
    room: string;
}

let allSockets: User[] = [];

wss.on('connection', (socket) => {
    socket.on('message', (message) => {
        const parsedMessage = JSON.parse(message as unknown as string);
        // if the message type is "join", we can add the user to a room
        if (parsedMessage.type === "join") {
            console.log(`User joined room: ${parsedMessage.payload.roomId}`);
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }

        if (parsedMessage.type === "chat") {
            console.log(`User sent message: ${parsedMessage.payload.message}`);
            // Find the room of the current user
            const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room;

            // Broadcast the message to all users in the same room
            allSockets.forEach((user) => {
                if (user.room === currentUserRoom) {
                    user.socket.send(JSON.stringify({
                        name: parsedMessage.payload.name,
                        message: parsedMessage.payload.message
                    }))
                }
            });
        }
    });

    socket.on('close', () => {
        // Remove the user from the list of all sockets when they disconnect
        allSockets = allSockets.filter((x) => x.socket !== socket);
    });
});