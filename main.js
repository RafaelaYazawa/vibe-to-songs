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
    animate();
    drawScatteredBalls();
  } else {
    audioElement.pause();
    isPlaying = false;
  }
}

const balls = [];

class Ball {
  constructor(x, y, size, color, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;

    this.life = 100;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    this.life--;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function animate() {
  if (!isPlaying) return;

  ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  balls.forEach((ball) => {
    ball.draw(ctx);
    ball.update(canvas.width, canvas.height);
  });

  for (let i = balls.length - 1; i >= 0; i--) {
    if (balls[i].life <= 0) {
      balls.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

function drawScatteredBalls() {
  if (!isPlaying) return;

  analyzer.getByteFrequencyData(dataArray);

  const bass = dataArray[5];

  if (bass > 115) {
    const impactX = Math.random() * canvas.width;
    const impactY = Math.random() * canvas.height;

    const red = Math.min(255, bass + Math.random() * 50);
    const green = 50 + Math.random() * 100;
    const blue = 150 + Math.random() * 100;

    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8;

      const speedX = Math.cos(angle) * speed;
      const speedY = Math.sin(angle) * speed;

      balls.push(
        new Ball(
          impactX,
          impactY,
          Math.random() * (bass / 15),
          `rgba(${red}, ${green}, ${blue}, 0.7)`,
          speedX,
          speedY,
        ),
      );
    }
  }

  requestAnimationFrame(drawScatteredBalls);
}
