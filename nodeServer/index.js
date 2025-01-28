const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
        methods: ["GET", "POST"]
    }
});

app.use(express.static('public'));

const users = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('new-user-joined', (name) => {
        console.log("New User:", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, user: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-left', users[socket.id]);
        delete users[socket.id];
    });
});

server.listen(8000, () => {
    console.log("Server is running on http://localhost:8000");
});
