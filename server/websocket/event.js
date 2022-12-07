// socket events

// importing schemas
import Message from '../schemas/Message.js';

export default async function socketEvent(socket, io) {
    // NEW EVENT: sending session data on connection
    const sessionData = {
        sessionID: socket.sessionID,
        userID: socket.sessionID,
    };
    socket.emit('session', sessionData);

    socket.broadcast.emit('online', {
        sessionID: socket.sessionID
    });     //  broadcast user connected on connection


    // NEW EVENT: private message event
    socket.join(socket.userID);     // make socket instance to join associated room

    socket.on('message', async ({ content, to }) => {
        // create new message
        const message = new Message({
            content,
            from: socket.userID,
            to,
            status: 'sent'
        });

        // send message
        socket.to(to).emit('message', message);

        // save message
        await message.save()
            .then(() => {
                console.log('Message saved.');
            })
            .catch(err => {
                console.log('Message cannot be saved.');
                console.error(err);
            })
    });

    // change message status to delivered event


    // NEW EVENT: disconnect event
    socket.on('disconnect', async () => {
        const matchingSockets = await io.in(socket.userID).allSockets();

        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            // session data
            const modifiedSessionData = {
                userID: socket.userID,
                username: socket.username,
            };

            // save session
            await io.sessionStore.saveSession(socket.sessionID, modifiedSessionData);
            socket.broadcast.emit('offline', {
                sessionID: socket.sessionID
            });  // broadcast disconnection status
        }


        console.log('user disconnected');
    });
}