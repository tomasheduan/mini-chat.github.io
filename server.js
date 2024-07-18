const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let users = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (msg) => {
        const username = msg.split(':')[0];
        if (!users[socket.id]) {
            users[socket.id] = username;
            io.emit('user update', Object.values(users));
        }
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            const username = users[socket.id];
            delete users[socket.id];
            io.emit('user update', Object.values(users));
            console.log(`${username} left the chat`);
        }
    });
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Escuchar en todas las interfaces de red
server.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
