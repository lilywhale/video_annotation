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