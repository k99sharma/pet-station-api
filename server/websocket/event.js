// socket events

// importing redis client
import { getRedisClient } from '../configs/redisConnection.js';

export default function socketEvent(socket, io) {
    const redisClient = getRedisClient();   // redis client

    // session event
    socket.emit('session', {
        sessionID: socket.sessionID,
        userID: socket.userID
    });

    // private event
    socket.join(socket.userID);     // make socket instance to join associated room

    socket.on('message', ({ content, to }) => {
        socket.to(to).emit('message', {
            content,
            from: socket.userID,
            to,
        });
    });


    // disconnect event
    socket.on('disconnect', async () => {
        const matchingSockets = await io.in(socket.userID).allSockets();

        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            // session data
            const sessionData = {
                userID: socket.userID,
                username: socket.username,
                connected: false
            };

            // save session in redis
            redisClient.set(socket.sessionID, JSON.stringify(sessionData))
                .then(() => {
                    console.log('Session is saved!');
                })
                .catch(err => {
                    console.error(err);
                    console.log('Session is not saved.');
                })
        }

        console.log('user disconnected');
    });
}