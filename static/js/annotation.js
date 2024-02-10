var min = 0;
var max_interval = 3000;
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



window.addEventListener('scroll', function() {
  var formSection = document.getElementById('form');
  var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  
  // Ajustez ces valeurs selon les besoins
  var fadeStart = 100; // Position de défilement où l'effet commence
  var fadeUntil = 400; // Position de défilement où l'effet se termine
  
  var opacity = 1;
  
  if (scrollPosition < fadeStart) {
    opacity = 1;
  } else if (scrollPosition > fadeStart && scrollPosition < fadeUntil) {
    opacity = 1 - (scrollPosition - fadeStart) / (fadeUntil - fadeStart);
  } else {
    opacity = 0;
  }
  
  formSection.style.opacity = opacity;
});


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

function onPlayerStateChange(event) {
  // Vérifie si la vidéo est en train de jouer
  if (event.data == YT.PlayerState.PLAYING) {
    checkVideoTime();
  }
}


function checkVideoTime() {
  var endTime = parseFloat($("#endTime").val()); // Obtenez le temps de fin
  if (!endTime) return; // Sortie si endTime n'est pas défini ou parseable

  var check = function() {
    var currentTime = player.getCurrentTime();
    if (currentTime >= endTime) {
      player.pauseVideo();
    } else {
      setTimeout(check, 100); // Vérifiez toutes les 100 millisecondes
    }
  };
  check(); // Commence la vérification
}


function onPlayerReady() {
  player.playVideo();
  timeupdater = setInterval(updateTime, 100);
  
  var $d5 = $("#range-slider");
  var $d5_buttons = $(".slider-controls");
  $d5.ionRangeSlider({
      type: "double",
      skin: "flat",
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
        
        updateDurationDisplay(data.to - data.from);
        limit_filter(data)
        $("#startTime").val(data.from);
        // Update the end time input field
        $("#endTime").val(data.to);
        
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
          }, (data.to - data.from) );
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
          $d5.trigger('change');
        }

        if (e.target.id == "slider-start-next" && duration.toFixed(1) <= max_interval) {
          var from = d5_instance.old_from + step;
          var to = d5_instance.old_to;
          seek(from);
          $d5.trigger('change');
        }

        if (e.target.id == "slider-next" && duration.toFixed(1) < max_interval) {
          var from = d5_instance.old_from;
          var to = d5_instance.old_to + step;
          seek(to);
          $d5.trigger('change');
        }

        if (e.target.id == "slider-end-prev" && duration.toFixed(1) <= max_interval) {
          var from = d5_instance.old_from;
          var to = d5_instance.old_to - step;
          seek(to);
          $d5.trigger('change');
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

  // Function to format the time in HH:MM:SS format
  function formatTime(timeInSeconds) {
    var date = new Date(null);
    date.setSeconds(timeInSeconds);
    return date.toISOString().substr(11, 8);
  }
}

function updateDurationDisplay(duration) {
  let formattedDuration = hhmmsss_prettify(duration);
  $("#ytduration").text(formattedDuration);
}
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    var maxDuration = player.getDuration();
    var $d5 = $("#range-slider");

    // Update the max value of the ionRangeSlider
    $d5.data("ionRangeSlider").update({ max: maxDuration });
  }
}

function handleYouTubePlayerChange(videoId) {
  // Destroy the existing player
  player.destroy();
  
  // Initialize the player with the new videoId
  onYouTubeIframeAPIReady(videoId);

  // Call the onPlayerReady function again to apply settings and event handlers
  onPlayerReady();
}
  /*$d5_buttons.on("change", function() {
    $("#startTime").val(formatTime(d5_instance.old_from));
    // Update the end time input field
    $("#endTime").val(formatTime(d5_instance.old_to));
  });*/






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
      window.location.href = updateUrlParameter(window.location.href, 'videoId', 'Fgy8tjrKy1Y&pp=ygUaY2FybG9zIGFsY2FyYXogdnMgZGpva292aWM%3D');
      return;
    }
    var regex = /(youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+))/i;
    var ytid  = yturl.match(regex);

    if(ytid && ytid[2].length == 11) {
      // Manually submit the form data to the Flask route using AJAX
      updateUrlParameter(window.location.href, 'videoId', ytid[2]);
      $.ajax({
        type: "POST",
        url: "/process_url", // Flask route for processing form data
        data: {url: yturl}, // Form data to be sent to the server
        success: function(response) {
          // Handle success response if needed
          console.log(response);
          player.loadVideoById(ytid[2]);
          //handleYouTubePlayerChange(ytid[2])
        },
        error: function(xhr, status, error) {
          // Handle error response if needed
          console.error(xhr.responseText);
        }
      });
    } else {
      alert('Invalid YouTube URL or ID! Please verify again.');
    }
  });
});


/***************************************************/
// Modification

$(function() {
  $("#slider-start-prev, #slider-start-next, #slider-end-prev, #slider-next").on("click", function() {
    // Récupérez les valeurs actuelles des champs de temps
    var startTimeInput = $("#startTime");
    var endTimeInput = $("#endTime");
    var startTime = parseFloat(startTimeInput.val());
    var endTime = parseFloat(endTimeInput.val());

    // Mettez à jour les valeurs en fonction du bouton cliqué
    if ($(this).attr("id") === "slider-start-prev" || $(this).attr("id") === "slider-start-next") {
      startTime = d5_instance.old_from;
      endTime = d5_instance.old_to;
    } else {
      startTime = d5_instance.old_from;
      endTime = d5_instance.old_to;
    }

    // Mettez à jour les champs de temps dans le formulaire
    startTimeInput.val(startTime);
    endTimeInput.val(endTime);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var annotationForm = document.querySelector('form[action="/submit_annotation"]');
  var isModify = false;
  index = 0;
  console.log(isModify)

  annotationForm.addEventListener('submit', function (event) {
      event.preventDefault();
      annotationIndex = event.target.dataset.index;
      console.log("annotation index")
      console.log(annotationIndex)
      console.log("index")
      console.log(index)
      var formData = new FormData(annotationForm);
      var url = isModify ? '/update_annotation/' + index : '/submit_annotation';
      console.log(url)

      // Send AJAX request to Flask server
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.onload = function () {
          if (xhr.status == 200) {
              Swal.fire({
                  title: 'Annotation enregistrée',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 2000  // 2 seconds
              }).then(function () {
                  annotationForm.reset();
                  isModify = false;
                  console.log(isModify)

                  // Fetch annotations after form submission
                  fetchAnnotations();
              });
          }
      };
      xhr.send(formData);
  });

  // Function to fetch annotations from the server
  function fetchAnnotations() {
      var xhrAnnotations = new XMLHttpRequest();
      xhrAnnotations.open('GET', '/get_annotations', true);
      xhrAnnotations.onload = function () {
          if (xhrAnnotations.status == 200) {
              var annotationData = JSON.parse(xhrAnnotations.responseText);
              updateTable(annotationData);
          }
      };
      xhrAnnotations.send();
  }

  // Function to update HTML table with new data
  function updateTable(annotationData) {
    var tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';

    // Rebuild table rows with new data
    annotationData.forEach(function (annotation, index) {
      var row = '<tr>';
      row += '<td>' + index + '</td>'; // Add the index
      row += '<td>' + annotation.playerName + '</td>';
      row += '<td>' + annotation.scoreAfter + '</td>';
      row += '<td>' + annotation.startTime + '</td>';
      row += '<td>' + annotation.endTime + '</td>';
      row += '<td>' + annotation.incomingShot + '</td>';
      row += '<td>' + annotation.incomingType + '</td>';
      row += '<td>' + annotation.outgoingType + '</td>';
      row += '<td>' + annotation.outgoingShot + '</td>';
      row += '<td>' + annotation.pointFinish + '</td>';
      row += '<td>' + annotation.position + '</td>';
      row += '<td><button class="btn btn-primary modify-btn" data-index="' + index + '">Modify</button></td>';
      row += '</tr>';
      tableBody.innerHTML += row;
});

// Add event listeners to the buttons
var modifyButtons = document.querySelectorAll('.modify-btn');


modifyButtons.forEach(function(button) {
  button.addEventListener('click', function(event) {
      isModify = true;
      console.log(isModify)
      index = event.target.dataset.index;
      console.log(index)
      // Get data of the row that triggered the update route
      var rowData = annotationData[index];
      // Call a function to populate the form with rowData
      populateForm(rowData);
  });
});

}

// Function to populate the form with row data
function populateForm(rowData) {
// Get form elements
var playerNameInput = document.getElementById('playerName');
var scoreAfterInput = document.getElementById('scoreAfter');
var startTimeInput = document.getElementById('startTime');
var endTimeInput = document.getElementById('endTime');
var incomingShotSelect = document.getElementById('incomingShot');
var incomingTypeSelect = document.getElementById('incomingType');
var outgoingTypeSelect = document.getElementById('outgoingType');
var outgoingShotSelect = document.getElementById('outgoingShot');
var pointFinishSelect = document.getElementById('pointFinish');
var positionSelect = document.getElementById('position');

// Populate form with rowData
playerNameInput.value = rowData.playerName;
scoreAfterInput.value = rowData.scoreAfter;
startTimeInput.value = rowData.startTime;
endTimeInput.value = rowData.endTime;
incomingShotSelect.value = rowData.incomingShot;
incomingTypeSelect.value = rowData.incomingType;
outgoingTypeSelect.value = rowData.outgoingType;
outgoingShotSelect.value = rowData.outgoingShot;
pointFinishSelect.value = rowData.pointFinish;
positionSelect.value = rowData.position;
window.scrollTo({
  top: 0,
  behavior: 'smooth'
});
}

  // Fetch annotations when the page loads
  fetchAnnotations();
});


function uploadVideo() {
  var videoInput = document.getElementById('videoFile');
  var file = videoInput.files[0];

  // Check if a file is selected
  if (!file) {
      alert("Please select a video file.");
      return;
  }

  // Prepare the FormData for the AJAX request
  var formData = new FormData();
  formData.append('videoFile', file);

  // Make an AJAX request to upload_video_desktop_app.py
  $.ajax({
      url: '/upload_video_desktop_app',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) 
      {

        // Extract the videoId from the response if available
        var videoId = response.link;
       
        alert("Video uploaded successfully! link: https://www.youtube.com/watch?v=: " + videoId);

        // Update the URL with the new videoId
        if (videoId) {
            window.location.href = updateUrlParameter(window.location.href, 'videoId', videoId);
        }
      },
      error: function(error) {
          alert("Error uploading video. Please try again.");
      }
  });
}