/* eslint-disable no-param-reassign */
// importing libraries
import { Server } from 'socket.io';

// importing middleware
import socketMiddleware from './middleware.js';

// importing socket event
import socketEvent from './event.js';

export default function socketServer(server) {
    const io = new Server(server, {
        cors: {
            origin: "https://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
         }
    });  // socket server

    // middleware
    socketMiddleware(io);

    // opening connection
    io.on('connection', (socket) => {
        // invoking events
        socketEvent(socket, io);
    });

}
