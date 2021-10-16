var socket = io()
let nScreens;

const readyButton = document.getElementById('ready-btn')

//Import URL to Youtube Video    
console.log("Inside main.js file");
var $inputSwitches = $(".inputSwitch"),
$inputs = $inputSwitches.find("input"),
$spans = $inputSwitches.find("span");
$spans.on("click", function() {
var $this = $(this);
$this.hide().siblings("input").show().focus().select();
}).each( function() {
var $this = $(this);
$this.text($this.siblings("input").val());
});
$inputs.on("blur", function() {
var $this = $(this);
$this.hide().siblings("span").text($this.val()).show();
}).on('keydown', function(e) {
if (e.which == 9) {
    e.preventDefault();
    if (e.shiftKey) {
    $(this).blur().parent().prevAll($inputSwitches).first().find($spans).click();
    } else {
    $(this).blur().parent().nextAll($inputSwitches).first().find($spans).click();
    }
}
}).hide();
// End Import URL to Youtube Video

var loaded = true;
function loadYoutubeVideo(){
    loaded = false;
    console.log("Entrou no loadYoutubeVideo");
    var videoURL = $("#videoURL").val();
    console.log("videoURL: "+videoURL);
    if(videoURL == "URL"){
        alert("Insira uma URL válida");
    }else if(!loaded){
        const videoID = getId(videoURL);
        var src = "https://www.youtube.com/embed/" + videoID;
        console.log(src);
        loaded = true;
        var video = document.getElementById("videoDisplay");
        video.style.display = "block";
        video.src = src;
        var displayConfig = viewport();
        video.width = displayConfig.width*0.98;
        video.height = displayConfig.height*0.98;
        setVideoReady(src);
    }else{
        alert("Seu video está sendo carregado!");
    }
}

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

function setVideoReady(videoUrl) {
    socket.emit('controller-video-ready', videoUrl)
    socket.emit('video-url', videoUrl)
}

readyButton.addEventListener('click', loadYoutubeVideo);

// socket functions/event listeners
/**
 * Screen setup method -> responsible for setting variables for screen
 * @param {Object} screen screen object containing info like screen number and total of screens
 */
 function screenSetup(screen) {
    nScreens = screen.nScreens;
}
socket.on("new-screen", screenSetup)