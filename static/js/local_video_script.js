document.addEventListener('DOMContentLoaded', function () {
    var video = document.getElementById('myVideo');
    console.log("start video")
    console.log(video.duration)
    var slider = document.getElementById('range-slider');

    // Set up initial values
    var min = 0;
    var max_interval = 3000;
    var step = 0.1;
    var from = 0;
    var to = 60;

    // Add event listeners
    video.addEventListener('timeupdate', updateTime);
    slider.addEventListener('input', handleSliderChange);

    // Function to update the timer and slider
    function updateTime() {
      slider.value = video.currentTime;
      document.getElementById('time').textContent = formatTimeWithTenths(video.currentTime);
  }
  
  // Function to format time in HH:MM:SS.S format with tenths of a second
  function formatTimeWithTenths(timeInSeconds) {
      var date = new Date(null);
      date.setSeconds(timeInSeconds);
      var formattedTime = date.toISOString().substr(11, 8);
      var tenths = Math.floor((timeInSeconds % 1) * 10); // Extract tenths of a second
      return formattedTime + "." + tenths;
  }

    // Function to handle slider change
    function handleSliderChange() {
        video.currentTime = slider.value;
    }

    // Function to format time in HH:MM:SS format
    function formatTime(timeInSeconds) {
        var date = new Date(null);
        date.setSeconds(timeInSeconds);
        return date.toISOString().substr(11, 8);
    }

    // Set up the range slider using Ion.RangeSlider
    video.addEventListener('loadedmetadata', function() {

      $('#range-slider').ionRangeSlider({
          type: 'double',
          skin: 'flat',
          min: min,
          max: video.duration, // Use video duration as max value
          max_interval: max_interval,
          step: step,
          from: from,
          to: to,
          drag_interval: true,
          grid: false,
          grid_snap: true,
          prettify: hhmmsss_prettify,
          onStart: function (data) {
              limit_filter(data);
          },
          onChange: function (data) {
              updateDurationDisplay(data.to - data.from);
              limit_filter(data);
              console.log("duration")
              console.log(video.duration)
              console.log("current time")
              console.log(video.currentTime)

              // Update start and end time input fields if needed
              $("#startTime").val(data.from);
              $("#endTime").val(data.to);
          },
          onFinish: function (data) {
              if (data.to > data.from) {
                  video.currentTime = data.from;
                  video.play();
                  setTimeout(function () {
                      if (video.currentTime >= data.to) {
                          video.pause();
                      }
                  }, (data.to - data.from) * 1000);
              }
          }
      });
    });
    // Function to update duration display
    function updateDurationDisplay(duration) {
        var formattedDuration = hhmmsss_prettify(duration);
        $("#ytduration").text(formattedDuration);
    }

});
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
    if (video.paused) {
        video.play();
    } else {
        video.pause();
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
    if (!isNaN(from)) {
        video.currentTime = from;
    }
}
  
  function hsl_col_perc(percent, start, end) {
    var a = percent / 100,
        b = (start - end) * a,
        c = b + end;
    // Return a CSS HSL string
    return 'hsl('+c+', 100%, 50%)';
  }
  
  
  
  function checkVideoTime() {
    var endTime = parseFloat($("#endTime").val()); // Obtenez le temps de fin
    if (!endTime) return; // Sortie si endTime n'est pas défini ou parseable
  
    var check = function() {
      var currentTime = video.currentTime;
      if (currentTime >= endTime) {
        video.pauseVideo();
      } else {
        setTimeout(check, 100); // Vérifiez toutes les 100 millisecondes
      }
    };
    check(); // Commence la vérification
  }

