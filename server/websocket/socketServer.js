/* eslint-disable no-param-reassign */
// importing libraries
import { Server } from 'socket.io';

// importing helper functions
// import { generateRandomID } from '../utilities/helper.js';

// importing socket feature
import privateChat from './privateChat.js';

export default function socketServer(server) {
    const io = new Server(server);  // socket server

    // middleware
    io.use((socket, next) => {
        const { username } = socket.handshake.query;
        if (!username) {
            return next(new Error("invalid username"));
        }

        socket.username = username;
        return next();
    });

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