/* eslint-disable no-param-reassign */
// socket events

export default async function socketEvent(socket, io) {
    // NEW EVENT: sending session data on connection with unseen messages
    // get all unseen messages for user
    // let unseenMessages = await io.messageStore.getAllUnseenMessages(socket.userID);

    // // mapping required data
    // unseenMessages = unseenMessages.map(message => {
    //     const payload = {
    //         content: message.content,
    //         from: message.from
    //     }

    //     return payload;
    // });

    // // mark all messages seen
    // io.messageStore.markMessageSeen(socket.userID);

    // // session payload
    // const sessionPayload = {
    //     sessionID: socket.sessionID,
    //     userID: socket.sessionID,
    //     unseen: {
    //         unseenMessages,
    //         count: unseenMessages.length
    //     }
    // };

    // socket.emit('session', sessionPayload);     // sending back to user

    // socket.broadcast.emit('online', {
    //     sessionID: socket.sessionID
    // });     //  broadcast user connected on connection


    // // NEW EVENT: private message event

    // socket.on('message', async ({ content, to }) => {
    //     // create new message
    //     // only save message which comes to me not I send
    //     const messagePayload = {
    //         content,
    //         from: socket.userID,
    //         to,
    //         seen:
    //             io.sessionStore.containsUser(socket.userID)
    //                 ?
    //                 io.sessionStore.getChatTab(to) === socket.userID
    //                 :
    //                 false
    //     };

    //     // send message
    //     socket.to(to).emit('message', messagePayload);

    //     // save message
    //     io.messageStore.saveMessage(messagePayload);
    // });

    // // NEW EVENT: if sender tab is open mark all msg as delivered
    // // map to keep track of user opened tab
    // socket.on('chatTab', ({ tabID }) => {
    //     // set tabID in map
    //     io.sessionStore.setChatTab(socket.userID, tabID);

    //     console.log(io.sessionStore.chatTab);
    // });

    // // NEW EVENT: notifications
    // socket.on('notification', () => {
    //     // TODO: to be implemented
    // })

    // // NEW EVENT: disconnect event
    // socket.on('disconnect', async () => {
    //     const matchingSockets = await io.in(socket.userID).allSockets();

    //     const isDisconnected = matchingSockets.size === 0;
    //     if (isDisconnected) {
    //         // session data
    //         const modifiedSessionData = {
    //             userID: socket.userID,
    //             username: socket.username,
    //         };

    //         // delete userID from chat tab map
    //         io.sessionStore.deleteChatTab(socket.userID);

    //         // save session
    //         await io.sessionStore.saveSession(socket.sessionID, modifiedSessionData);
    //         socket.broadcast.emit('offline', {
    //             sessionID: socket.sessionID
    //         });  // broadcast disconnection status
    //     }

    //     console.log('user disconnected');
    // });

    socket.join(socket.username);     // make socket instance to join associated room

    // event: session
    socket.emit('session', `${socket.username} is connected!`);

    // event: online status
        socket.broadcast.emit('online', {
            username: socket.username
    });     //  broadcast user connected on connection

    // event: message
    socket.on('message', ({ content, to })=>{
        socket.to(to).emit('message', {
            content,
            from: socket.username
        });
    });

    // NEW EVENT: disconnect event
    socket.on('disconnect', async () => {
        const matchingSockets = await io.in(socket.username).allSockets();

        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            socket.broadcast.emit('offline', {
                username: socket.username
            });  // broadcast disconnection status
        }
    });
}