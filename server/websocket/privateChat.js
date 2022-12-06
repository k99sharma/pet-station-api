// private chat socket event
export default function privateChat(socket, io) {
    // socket.on('chat', (msg) => {
    //     console.log(`message: ${msg}`);

    //     io.emit('chat', msg);
    // });

    const users = [];

    const availableConnections = io.of("/").sockets;
    // eslint-disable-next-line no-restricted-syntax
    for (const [id, conn] of availableConnections) {
        users.push({
            userID: id,
            username: conn.username,
        });
    }

    socket.emit("users", users);


    socket.broadcast.emit("user connected", {
        userID: socket.id,
        username: socket.username,
    });

    socket.on("chat", ({ content, to }) => {
        socket.to(to).emit("chat", {
            content,
            from: socket.id,
        });
    });
}