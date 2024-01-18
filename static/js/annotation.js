var min = 0;
var max_interval = 1800;
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

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '315',
    width: '560',
    videoId: '7JMV6iBlXFo',
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
          player.loadVideoById({
            videoId: player.getVideoData()['video_id'],
            startSeconds: data.from,
            endSeconds: data.to
          });
        }
      },
      onUpdate: function (data) {
      }
  });

  var d5_instance = $d5.data("ionRangeSlider")
  let duration = d5_instance.old_to - d5_instance.old_from

  
  $("#preview").click(function(e) {
    if((d5_instance.old_from - d5_instance.old_to) < 0) {
      player.loadVideoById({
        videoId: player.getVideoData()['video_id'],
        startSeconds: d5_instance.old_from,
        endSeconds: d5_instance.old_to
      });
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

$(function(){

  $("#form form").submit(function(e) {
  e.preventDefault(); // avoid to execute the actual submit of the form.

  var yturl = $("form .url").val();
  if(yturl == '') {
    player.loadVideoById('t0IziCyyMaE', 0);
    return
  }
  var regex = /(youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+))/i; // https://regex101.com/r/JwS9rI/1
  var ytid  = yturl.match(regex);

  if(ytid){
    if(ytid[2].length == 11) {
      player.loadVideoById(ytid[2], 0);
      $(".player-timing input").val('0:00:00.0');
    } else {
      alert('Invalid YouTube ID! Please verify the link again.');
    }
  } else {
    alert('Invalid YouTube URL! Please copy the link again.');
  }
  });
});