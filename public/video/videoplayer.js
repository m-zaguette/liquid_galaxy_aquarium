var socket = io()

const watchButton = document.getElementById('watch-btn');
watchButton.style.display = "none";

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

socket.on('video-url', (videoUrl) => {
    var video = document.getElementById("videoDisplay");
    video.style.display = "block";
    video.src = videoUrl;
    // + "?autoplay=1";
    var displayConfig = viewport();
    video.width = displayConfig.width*0.25;
    video.height = displayConfig.height*0.25;
    // window.scrollTo(0, document.body.scrollHeight);
    watchButton.style.display = "block";
});

socket.on('all-videos-ready', ()=>{
    var video = document.getElementById("videoDisplay");
    video.src += "?autoplay=1";
});

function setVideoPlayerReady(){
    socket.emit('log-message',`setVideoPlayerReady by ID inside videoplayer.js: ${socket.id}`);
    socket.emit('player-video-ready', socket.id);  
}
watchButton.addEventListener('click', setVideoPlayerReady);
