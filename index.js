const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const filePath = "/public"; // Do not add '/' at the end
const controllerFile = "controller/index.html";


app.get('/:id', (req, res) => {
    const id = req.params.id;
    if(id == "controller"){
        res.sendFile(__dirname + `${filePath}/${controllerFile}`);
    }else{
        screenNumber = id;
        res.sendFile(__dirname + '/index.html');
    }
});

io.on('connection', (socket) => {
    socket.broadcast.emit('hi');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    // socket.on('chat message', (msg) => {
    //     console.log('message: ' + msg);
    //     console.log('__dirname ' + __dirname);
    //     console.log('filePath ' + filePath);
    // });

    console.log(`A user connected with id ${socket.id}`);

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

