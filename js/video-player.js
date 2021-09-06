/******************************************************************************/
/*  Функция инициализации видео-плеера для воспроизведения видео с указанными */
/*  периодами фрагментов                                                      */
/*  Параметры:                                                                */
/*    src - источник видео                                                    */
/*    periods - список периодов - двумерный массив                            */
/*    first - индекс периода, с которого нужно начать воспроизведение         */
/*    elements - селекторы элементов плеера                                   */
/******************************************************************************/

function initPlayer(params) {

  var videoPlayer = document.querySelector(params.elements.videoPlayer);
  var newVideoPlayer = videoPlayer.cloneNode(true);
  videoPlayer.parentNode.replaceChild(newVideoPlayer, videoPlayer);
  videoPlayer=newVideoPlayer;

  var videoControls = document.querySelector(params.elements.videoControls);
  var newVideoControls = videoControls.cloneNode(true);
  videoControls.parentNode.replaceChild(newVideoControls, videoControls);
  videoControls=newVideoControls;

  var videoInitialized=false;
  var firstPeriod=true;

  var playPauseBtn = document.querySelector(params.elements.playPauseButton);
  var soundOffOnBtn = document.querySelector(params.elements.soundOffOnButton);

  var progressBar = document.querySelector(params.elements.progressBar);
  var track = document.querySelector(params.elements.progressTrack);
  var timer = document.querySelector(params.elements.timeDisplay);
  var periodsDisplay = document.querySelector(params.elements.periodsDisplay);

  periodsDisplay.innerHTML = "";

  videoPlayer.src = params.src;
  videoPlayer.preload = true;
  videoPlayer.controls = false;
  videoPlayer.pause();

  videoPlayer.addEventListener("canplaythrough", initPlayback);
  playPauseBtn.addEventListener("click", toggleVideoStatus);
  soundOffOnBtn.addEventListener("click", toggleVideoSound);
  progressBar.addEventListener("click", seeked);

  function initPlayback() {
    if (!videoInitialized) {
      videoPlayer.addEventListener("play", updateIcon);
      videoPlayer.addEventListener("pause", updateIcon);
      videoPlayer.addEventListener("timeupdate", setSliderAndTimer);
      videoPlayer.currentTime=params.periods[params.first][0];
      videoPlayer.play();
      videoInitialized=true;

      updateSoundIcon();

      var positions=[];
      var level=0;

      for (var i = 0; i < params.periods.length; i++) {
        var pBegin = params.periods[i][0];
        var pEnd = params.periods[i][1];
        var period = document.createElement('div');
        period.className = 'period';
        period.style.left=pBegin*100/videoPlayer.duration+"%";
        period.style.width=(pEnd-pBegin)*100/videoPlayer.duration+"%";
        periodsDisplay.appendChild(period);
        var periodRight = document.createElement('div');
        periodRight.className = 'period-right';
        period.appendChild(periodRight);
        var periodLeft = document.createElement('div');
        periodLeft.className = 'period-left';
        period.appendChild(periodLeft);
        var periodTitle = document.createElement('div');
        periodTitle.className = 'period-bubble';
        periodTitle.dataset.begin = pBegin;
        periodTitle.dataset.index = i;
        periodTitle.innerHTML = formatTime(pBegin)+" - "+formatTime(pEnd);
        periodTitle.addEventListener("click", function (e) {
          videoPlayer.currentTime=e.currentTarget.dataset.begin;
          videoPlayer.play();
          params.first=e.currentTarget.dataset.index;
          firstPeriod=true;
          e.preventDefault();
          e.stopPropagation();
        });
        period.appendChild(periodTitle);

        var position=periodTitle.getBoundingClientRect();

        if (positions.length>0) {
          var lastPosition=positions[positions.length-1];
          if ((lastPosition.x+lastPosition.width)>position.x) {
            if ((level>0)&&(positions.length>1)) {
              var lastLastPosition=positions[positions.length-2];
              if ((lastLastPosition.x+lastLastPosition.width)>position.x) {
                level++;
              } else {
                level=0;
              }
            } else {
              level++;
            }
          } else {
            level=0;

          }
        }
        periodTitle.style.top = 36+level*20+"px";
        positions.push(position);
      }
    }
  }

  function updateIcon() {
    if (videoPlayer.paused) {
      playPauseBtn.innerHTML = "<i class='play-button'></i>";
    } else {
      playPauseBtn.innerHTML = "<i class='pause-button'></i>";
    }
  }

  function toggleVideoStatus() {
    if (videoPlayer.paused) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();
    }
  }

  function toggleVideoSound() {
    if (videoPlayer.muted) {
      videoPlayer.muted=false;
    } else {
      videoPlayer.muted=true;
    }
    updateSoundIcon();
  }

  function updateSoundIcon() {
    if (videoPlayer.muted) {
      soundOffOnBtn.innerHTML = "<i class='sound-off-button'></i>";
    } else {
      soundOffOnBtn.innerHTML = "<i class='sound-on-button'></i>";
    }
  }

  function formatTime(time) {
    var minutes = Math.floor(time / 60);
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    var seconds = Math.floor(time % 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return minutes+":"+seconds;
  }

  function setSliderAndTimer() {
    timer.textContent = formatTime(videoPlayer.currentTime)+"/"+formatTime(videoPlayer.duration);

    var position = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    track.style.width=position+"%";

    if ((firstPeriod)&&(videoPlayer.currentTime >= params.periods[params.first][1])) {
      videoPlayer.currentTime = params.periods[params.first][1];
      videoPlayer.pause();
      firstPeriod=false;
    } else
    if ((videoPlayer.currentTime>0)&&(videoPlayer.currentTime == videoPlayer.duration)) {
      videoPlayer.pause();
    }
  }

  function seeked(event) {
    videoPlayer.currentTime = (event.offsetX/event.currentTarget.offsetWidth) * videoPlayer.duration;
  }

}
