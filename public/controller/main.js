var socket = io()
let nScreens;

const readyButton = document.getElementById('ready-btn')


var loaded = true;
function loadYoutubeVideo(){
    loaded = false;
    var videoURL = document.getElementById("videoURL").value;
    if(videoURL == "URL"){
        alert("Insira uma URL válida");
    }else if(!loaded){
        const videoID = getId(videoURL);
        loaded = true;
        setVideoReady(videoID);
    }else{
        alert("Seu video está sendo carregado!");
    }
}
readyButton.addEventListener('click', loadYoutubeVideo);

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

function getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
    ? match[2]
    : null;
}

function setVideoReady(videoId) {
    socket.emit('controller-video-ready', videoId)
}


// socket functions/event listeners
/**
 * Screen setup method -> responsible for setting variables for screen
 * @param {Object} screen screen object containing info like screen number and total of screens
 */
function screenSetup(screen) {
    nScreens = screen.nScreens;
}
socket.on("new-screen", screenSetup)