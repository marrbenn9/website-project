
// main div //

let mainDiv = document.createElement('div')
mainDiv.id = 'main-div'

const videoId = 'aIESFjd2ntI'

document.body.appendChild(mainDiv)

function onYouTubeIframeAPIReady(){
    initYTplayer(mainDiv.id, videoId)
}




