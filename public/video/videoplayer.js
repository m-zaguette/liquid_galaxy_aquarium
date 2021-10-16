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
        width: `${displayConfig.width*0.98}`,
        videoId: `${videoId}`,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
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

function pauseVideo(){
    player.pauseVideo();
}

function playVideo(){
    player.playVideo();
}

socket.on('video-url', (videoId) => {
    
    socket.emit('log-message','Dentro de videoplayer.js executando video-url');
    onYouTubeIframeAPIReady(videoId);
    // var video = document.getElementById("videoDisplay");
    // video.style.display = "block";
    // video.src = videoUrl;
    // // + "?autoplay=1";
    // var displayConfig = viewport();
    // video.width = displayConfig.width*0.25;
    // video.height = displayConfig.height*0.25;
    // // window.scrollTo(0, document.body.scrollHeight);
    watchButton.style.display = "block";
    playButton.style.display = "block";
    pauseButton.style.display = "block";
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

playButton.addEventListener('click', playVideo);
pauseButton.addEventListener('click', pauseVideo);
