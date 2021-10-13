const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.broadcast.emit('hi');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);  
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });

    console.log('a user connected');

    socket.on('disconnect', () => {    
      console.log('user disconnected');  
    });

     // This will emit the event to all connected sockets
    io.emit('some event', { 
        someProperty: 'some value', otherProperty: 'other value'
    });
});

server.listen(3000, () => {  console.log('listening on *:3000');
});

