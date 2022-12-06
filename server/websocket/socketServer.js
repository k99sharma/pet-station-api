// importing libraries
import { Server } from 'socket.io';

// importing socket feature
import privateChat from './privateChat.js';

export default function socketServer(server) {
    const io = new Server(server);  // socket server

    // opening connection
    io.on('connection', (socket) => {
        console.log('user connected');

        // private chat feature
        privateChat(socket, io);

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

}