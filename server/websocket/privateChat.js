// private chat socket event
export default function privateChat(socket, io) {
    socket.on('chat', (msg) => {
        console.log(`message: ${msg}`);

        io.emit('chat', msg);
    });
}