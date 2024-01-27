function toggleWindow(windowId) {
    var window = document.getElementById('window' + windowId);
    window.style.display = (window.style.display === 'none') ? 'block' : 'none';
    
    var windows = document.getElementsByClassName('window');
    for (var i = 0; i < windows.length; i++) {
        if (windows[i].id !== 'window' + windowId) {
            windows[i].style.display = 'none';
        }
    }
}
function updateDifficulty(windowId) {
    var difficulty = document.getElementById('difficulty' + windowId).value;
    console.log('Niveau de difficulté : ' + difficulty);
    // Autres actions à effectuer avec la valeur du niveau de difficulté
}

document.addEventListener("DOMContentLoaded", function() {
    var video = document.getElementById("myVideo");
    var playPauseBtn = document.getElementById("playPauseBtn");

    playPauseBtn.addEventListener("click", function() {
        if (video.paused || video.ended) {
            video.play();
            playPauseBtn.innerHTML = "&#10074;&#10074;"; // Pause symbol
        } else {
            video.pause();
            playPauseBtn.innerHTML = "&#9658;"; // Play symbol
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var video = document.getElementById('myVideo');
    var playPauseBtn = document.getElementById('playPauseBtn');

    playPauseBtn.addEventListener('click', function () {
        if (video.paused || video.ended) {
            video.play();
            playPauseBtn.innerHTML = '&#10074;&#10074;'; // Pause symbol
        } else {
            video.pause();
            playPauseBtn.innerHTML = '&#9658;'; // Play symbol
        }
    });

    // Additional controls can be added based on your requirements
});

var min = 0;
var max_interval = 1000;
var step = 0.1;
var from = 0;
var to = 60;
var videotime = 0;


var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var player;


/****************************************/
// (Modification) 
// Fonction pour extraire les paramètres de l'URL
function getQueryParam(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var videoId = getQueryParam('videoId') || 'WNCl-69POro'; // ID par défaut si aucun paramètre n'est trouvé

// Fonction pour mettre à jour les paramètres de l'URL
function updateUrlParameter(url, paramName, paramValue) {
    var pattern = new RegExp('('+paramName+'=).*?(&|$)'),
        newUrl = url.replace(pattern, '$1' + paramValue + '$2');
    if (!url.match(pattern)) {
        newUrl = newUrl + (newUrl.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue;
    }
    return newUrl;
}