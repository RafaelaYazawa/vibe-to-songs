const audioPlayer = document.getElementById("play-audio");
const resetBtn = document.getElementById("reset-btn");
const audio = new Audio("./audios/JENNIE -Seoul_City.mp3");

audioPlayer.addEventListener("click", playAudio);

resetBtn.addEventListener("click", resetAudio);

function playAudio() {
  if (!audio) {
    console.error("Audio element not found");
    return;
  }

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function resetAudio() {
  if (!audio) {
    console.error("Audio element not found");
    return;
  }

  audio.pause();
  audio.currentTime = 0;
}
