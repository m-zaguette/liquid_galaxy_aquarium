var socket = io()

const watchButton = document.getElementById('watch-btn');
watchButton.style.display = "none";
const playButton = document.getElementById('play-btn');
playButton.style.display = "none";
const pauseButton = document.getElementById('pause-btn');
pauseButton.style.display = "none";
var player;

function viewport()
{
    var e = window
    , a = 'inner';
    if ( !( 'innerWidth' in window ) )
    {
    a = 'client';
    e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}

function onYouTubeIframeAPIReady(videoId){
    var displayConfig = viewport();
    player = new YT.Player('player', {
        height: `${displayConfig.height*0.98}`,
        width: `${displayConfig.width*1.96}`,
        videoId: `${videoId}`,
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
    event.target.pauseVideo();
}

function onPlayerStateChange(event) {
    var done = false;
    if (event.data == YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo, 6000);
      done = true;
    }
}

function stopVideo() {
    player.stopVideo();
}

function requestPauseVideo(){
    socket.emit('log-message', `Resquested by Id: ${socket.id} to pause the video`);
    socket.emit('pause-request');
}

function pauseVideo(){
    player.pauseVideo();
}

function requestPlayVideo(){
    socket.emit('log-message', `Resquested by Id: ${socket.id} to play the video`);
    socket.emit('play-request');
}

function playVideo(){
    player.playVideo();
}

socket.on('video-url', objectId => {
    let screen = 0;
    for(let i=0; i< objectId.ids.length; i++){
        if((objectId.ids[i][0]) == socket.id){
            screen = i;
        }
    }
    onYouTubeIframeAPIReady(objectId.videoId);
    watchButton.style.display = "block";
    playButton.style.display = "block";
    pauseButton.style.display = "block";
    if(screen == 1){
        window.scrollTo(0, 0);
    }else{
        window.scrollTo(10000, 0);
    }
});

socket.on('all-videos-ready', ()=>{
    playVideo();
});

socket.on('pause-all', () => {
    pauseVideo();
});

socket.on('play-all', () => {
    playVideo();
});

function setVideoPlayerReady(){
    socket.emit('log-message',`setVideoPlayerReady by ID inside videoplayer.js: ${socket.id}`);
    socket.emit('player-video-ready', socket.id);  
}
watchButton.addEventListener('click', setVideoPlayerReady);

playButton.addEventListener('click', requestPlayVideo);
pauseButton.addEventListener('click', requestPauseVideo);
