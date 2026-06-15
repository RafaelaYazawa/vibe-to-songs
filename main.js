const playBtn = document.getElementById("play-btn");
const resetBtn = document.getElementById("reset-btn");
const audio = new Audio("./audios/JENNIE -Seoul_City.mp3");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let audioCtx;
let audioSource;
let analyzer;
let isPlaying;
let bufferLength;
let dataArray;

playBtn.addEventListener("click", playAudio);

resetBtn.addEventListener("click", resetAudio);

function resetAudio() {
  if (!audio) {
    console.error("Audio element not found");
    return;
  }

  audio.currentTime = 0;
}

function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  audioSource = audioCtx.createMediaElementSource(audio);
  analyzer = audioCtx.createAnalyser();

  audioSource.connect(analyzer);
  analyzer.connect(audioCtx.destination);

  analyzer.fftSize = 256;
  bufferLength = analyzer.frequencyBinCount;

  dataArray = new Uint8Array(bufferLength);

  return audio;
}

let audioElement;
let barHeight;

function playAudio() {
  if (!audioCtx) {
    audioElement = initAudio();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  if (!isPlaying) {
    audioElement.play();
    isPlaying = true;
    drawVisualizer();
  } else {
    audioElement.pause();
    isPlaying = false;
  }
}

function drawVisualizer() {
  if (!isPlaying) return;

  requestAnimationFrame(drawVisualizer);

  analyzer.getByteFrequencyData(dataArray);

  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];

    const red = barHeight + 25 * (i / bufferLength);
    const green = 250 * (i / bufferLength);
    const blue = 50;

    ctx.fillStyle = `rgb(${red},${green},${blue})`;

    // Draw the rectangle bar (canvas 0,0 is top-left, so subtract height from canvas height)
    ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

    x += barWidth;
  }
}
