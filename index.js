const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const filePath = "/public"; // Do not add '/' at the end
const controllerFile = "controller/index.html";
const videoFile = "/index.html";
var ids = [];

app.use(express.static(__dirname + filePath));

app.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    if(id == "controller")
    {
        res.sendFile(__dirname + `${filePath}/${controllerFile}`);
    }
    else
    {
        screenNumber = id;
        res.sendFile(__dirname + `${filePath}/${videoFile}`);
    }
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    console.log(`A user connected with id ${socket.id}`);
    ids.push(socket.id);

    socket.on('disconnect', () => {    
      console.log(`user disconnected ${socket.id}`);
      ids.forEach( (item) => {
            if (item == socket.id){
                var index = ids.indexOf(item);
                if(index > -1){
                    ids.splice(index);
                }                
            }
      });
    });

     // This will emit the event to all connected sockets
    io.emit('some event', { 
        someProperty: 'some value', otherProperty: 'other value'
    });

    /**
     * On Player Ready Mehtod -> responsible for checking if all players are ready and emitting to all sockets when they are
     * @param {String} id id of the player
     */
    function onVideoReady(id) {
        console.log(`Video ready for ${id}`);
    // try {
    //     if (!hasGameStarted) {
    //         players[id].ready = true

    //         let hasPlayerUnready = false
    //         for (const id in players) {
    //             if (players[id].ready == false) {
    //                 hasPlayerUnready = true
    //             }
    //         }

    //         // emit to allow game start
    //         if (!hasPlayerUnready) {
    //             console.log('All players ready!')
    //             io.emit('all-players-ready')
    //             hasGameStarted = true
    //         } else {
    //             console.log('Waiting for other players...')
    //         }
    //     } else {
    //         io.emit('show-game-has-started')
    //     }
    // } catch (err) {
    //     console.log('Error on onPlayerReady methods:', err)
    // }
    }
    socket.on('video-ready', onVideoReady)

    /**
     * On Player Ready Mehtod -> responsible for checking if all players are ready and emitting to all sockets when they are
     * @param {String} videoUrl id of the player
     */
    function controllerVideoReady(videoUrl) {
        console.log(`Controller Video Ready for video ${videoUrl}`);
        io.emit('video-url',videoUrl);
        console.log('VideoUrl Emitido');
    }
    socket.on('controller-video-ready', controllerVideoReady)

    socket.on('video-url', (videoUrl) => {
        console.log('Recebido emissao do videoUrl');
        io.emit('video-url', videoUrl);
    })
});

server.listen(3000, () => {  console.log('listening on *:3000');
});

function consoleLog(item)
{
    console.log(`${item}`);
}

