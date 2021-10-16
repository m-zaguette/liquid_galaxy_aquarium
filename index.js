const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const filePath = "/public"; // Do not add '/' at the end
const controllerFile = "controller/index.html";
const videoFile = "video/index.html";
var ids = [];
var controllerId;
var screenNumber = 1;
var myArgs = process.argv.slice(2);
var nScreens = Number(myArgs[0]);

app.use(express.static(__dirname + filePath));

app.get('/:id', (req, res) => {
    const id = req.params.id;
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

    logMessage(`A user connected with id ${socket.id}`);
    socket.emit("new-screen", { number: Number(screenNumber), nScreens: nScreens })
    ids.push([socket.id,false]);

    socket.on('disconnect', () => {    
        logMessage(`user disconnected ${socket.id}`);
        ids.forEach( (item) => {
            if (item[0] == socket.id){
                var index = ids.indexOf(item);
                var howManyToRemove = 1;
                if(index > -1){
                    ids.splice(index,howManyToRemove);
                }                
            }
        });
    });

     // This will emit the event to all connected sockets
    io.emit('some event', { 
        someProperty: 'some value', otherProperty: 'other value'
    });

    function checkAllVideoReady(){
        var BreakException = {};
        try{
            ids.forEach( (item) =>{
                if(item[1]==false){
                    throw BreakException;
                } 
            });
            logMessage("all-videos-ready");
            io.emit('all-videos-ready');
        }catch (e){
        }
    }

     /**
     * On Player Ready Mehtod -> responsible for checking if all players are ready and emitting to all sockets when they are
     * @param {String} id id of the player
     */
      function onVideoReady(id) {
        ids.forEach((item)=>{
            if(item[0]==id){
                item[1] = true;
            }else if(controllerId == id){
                item[1] = false;
            }
        });
        console.log(ids);
        checkAllVideoReady();
    }
    socket.on('player-video-ready', onVideoReady)

    /**
     * On Player Ready Mehtod -> responsible for checking if all players are ready and emitting to all sockets when they are
     * @param {String} videoUrl id of the player
     */
    function controllerVideoReady(videoUrl) {
        logMessage(`Controller Video Ready inside index.js for video ${videoUrl}`);
        controllerId = socket.id;
        onVideoReady(socket.id, "controller");
        io.emit('video-url',videoUrl);
    }
    socket.on('controller-video-ready', controllerVideoReady)


   

    /**
     * @param {String} logs
     */
    function logMessage(logs){
        console.log(`Log: ${logs}`);
    }
    socket.on('log-message', logMessage)
});

server.listen(3000, () => {  console.log('listening on *:3000');
});
