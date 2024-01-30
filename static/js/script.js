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

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '315',
      width: '560',
      videoId: videoId,
      playerVars: { 
        'autoplay': 1,
        'controls': 1,
        'disablekb': 1,
        'rel' : 0,
        'fs' : 0,
        'start' : 0,
        // 'end' : 10, 
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }
  
  function onPlayerStateChange() {
    // console.log(player.getPlayerState())
  }
  
  function onPlayerReady() {
    player.playVideo();
    timeupdater = setInterval(updateTime, 100);
    
    var $d5 = $("#range-slider");
    var $d5_buttons = $(".slider-controls");
    $d5.ionRangeSlider({
        type: "double",
        skin: "round",
        min: min,
        max: player.getDuration(),
        max_interval: max_interval,
        step: step,
        from: from,
        to: to,
        drag_interval: true,
        grid: false,
        grid_snap: true,
        prettify: hhmmsss_prettify,
        onStart: function (data) {
          limit_filter(data)
        },
        onChange: function (data) {
          limit_filter(data)
        },
        onFinish: function (data) {
          if(data.to > data.from){
            // Se déplacer au temps de début
            player.seekTo(data.from, true);
            
            // Démarrer la lecture
            player.playVideo();
  
            // Arrêter la vidéo au temps de fin
            setTimeout(function() {
              if (player.getCurrentTime() >= data.to) {
                player.pauseVideo();
              }
            }, (data.to - data.from) * 1000);
          }
        }
    });
  
    var d5_instance = $d5.data("ionRangeSlider")
    let duration = d5_instance.old_to - d5_instance.old_from
  
    
    // (Modification)
    $("#preview").click(function(e) {
      // on vérifie que le temps de début est moins que le temps de fin
      if (d5_instance.old_from < d5_instance.old_to) {
        // Pour se déplacer au temps de début
        player.seekTo(d5_instance.old_from, true);
    
        // Pour Démarrer la lecture
        player.playVideo();
    
        // Pour Arrêter la vidéo au temps de fin
        setTimeout(function() {
          if (player.getCurrentTime() >= d5_instance.old_to) {
            player.pauseVideo();
          }
        }, (d5_instance.old_to - d5_instance.old_from) * 1000);
      }
    });
    
  
    $d5_buttons.on("mousedown", function (e) {
      isHeldDown = true;
        (function loop (range) {
          if (!isHeldDown) return
          // if (1 == 2) {
          //   player.loadVideoById({
          //     videoId: player.getVideoData()['video_id'],
          //     startSeconds: d5_instance.old_from,
          //     endSeconds: d5_instance.old_to
          //   });
          // }
          if (e.target.id == "slider-start-prev" && duration.toFixed(1) < max_interval) {
            var from = d5_instance.old_from - step;
            var to = d5_instance.old_to;
            seek(from);
          }
  
          if (e.target.id == "slider-start-next" && duration.toFixed(1) <= max_interval) {
            var from = d5_instance.old_from + step;
            var to = d5_instance.old_to;
            seek(from);
          }
  
          if (e.target.id == "slider-next" && duration.toFixed(1) < max_interval) {
            var from = d5_instance.old_from;
            var to = d5_instance.old_to + step;
            seek(to);
          }
  
          if (e.target.id == "slider-end-prev" && duration.toFixed(1) <= max_interval) {
            var from = d5_instance.old_from;
            var to = d5_instance.old_to - step;
            seek(to);
          }
  
          d5_instance.update({
            from: from,
            to: to
          })
  
          setTimeout(loop, 125)
        })();
  
    }).on("mouseup mouseleave", function () {
      isHeldDown = false;
    });
  }
  
  function limit_filter(data) {
    let duration = data.to - data.from
  
    if(duration == 0) {
      $("#d-pscreen").css('opacity','1').css('cursor','pointer')
      $("#d-file").css('opacity','0.5').css('cursor','no-drop')
      $("#d-audio").css('opacity','0.5').css('cursor','no-drop')
      $("#d-gif").css('opacity','0.5').css('cursor','no-drop')
    } else {
      $("#d-pscreen").css('opacity','0.5').css('cursor','no-drop')
      $("#d-file").css('opacity','1').css('cursor','pointer')
      $("#d-audio").css('opacity','1').css('cursor','pointer')
      $("#d-gif").css('opacity','1').css('cursor','pointer')
    }
    
    if(duration >= 0.1 && duration <= 10) {
      $("#d-gif").css('opacity','1').css('cursor','pointer')
    } else {
      $("#d-gif").css('opacity','0.5').css('cursor','no-drop')
    }
    
    let percentage = duration / max_interval * 100
    let color = hsl_col_perc(percentage, 0, 100)
    $("#ytduration").text(hhmmsss_prettify(duration)).css('color', color)
  }
  $("#time").click(function(e) {
      if(player.getPlayerState() == 2 || player.getPlayerState() == 5 || player.getPlayerState() == -1) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
  });
  function hhmmsss_prettify (n) {
      var sec_num = parseInt(n, 10); // don't forget the second param
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);
      var milisec = n;
  
      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      if (milisec < 10) {milisec = "0"+milisec;}
      return hours+':'+minutes+':'+seconds+'.'+(milisec % 1).toFixed(1).substring(2);
  }
  
  function seek(from) {
    if(player.getPlayerState() == 1) {
      player.pauseVideo()
    }
    if(player.getPlayerState() == 2) {
      player.seekTo(from);
    }  else {
      // player.pauseVideo();
    }
  }
  
  function hsl_col_perc(percent, start, end) {
    var a = percent / 100,
        b = (start - end) * a,
        c = b + end;
    // Return a CSS HSL string
    return 'hsl('+c+', 100%, 50%)';
  }
  
    function updateTime() {
      if(player && player.getCurrentTime) {
        videotime = player.getCurrentTime().toFixed(1);
  
        $("#time").text(hhmmsss_prettify(videotime));
      }
    }
  
  
  /***************************************************/
  // (Modification)
  
  $(function(){
    $("#form form").submit(function(e) {
      e.preventDefault();
  
      var yturl = $("form .url").val();
      if(yturl == '') {
        window.location.href = updateUrlParameter(window.location.href, 'videoId', 't0IziCyyMaE');
        return;
      }
      var regex = /(youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+))/i;
      var ytid  = yturl.match(regex);
  
      if(ytid && ytid[2].length == 11) {
        window.location.href = updateUrlParameter(window.location.href, 'videoId', ytid[2]);
      } else {
        alert('Invalid YouTube URL or ID! Please verify again.');
      }
    });
  });