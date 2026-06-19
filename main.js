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

  const title = document.querySelector(".title");

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  if (!isPlaying) {
    audioElement.play();
    isPlaying = true;
    animate();
    drawScatteredBalls();
    playBtn.textContent = "Pause";
    title.style.display = "none";
  } else {
    audioElement.pause();
    isPlaying = false;
    playBtn.textContent = "Play";
    title.style.display = "block";
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

    this.speedX *= 0.97;
    this.speedY *= 0.97;

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

  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
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
    const intensity = bass / 255;

    let red;
    let green;
    let blue;

    // console.log("Bass intensity:", intensity);
    if (intensity > 0.81) {
      red = 92 * intensity;
      green = 166 * intensity;
      blue = 206 * intensity;
    } else if (intensity < 0.81) {
      red = 185 * intensity;
      green = 110 * intensity;
      blue = 120 * intensity;
    } else {
      red = 115 * intensity;
      green = 90 * intensity;
      blue = 255 * intensity;
    }

    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3;

      const speedX = Math.cos(angle) * speed;
      const speedY = Math.sin(angle) * speed;

      balls.push(
        new Ball(
          impactX,
          impactY,
          Math.random() * (bass / 200),
          `rgba(${red}, ${green}, ${blue}, 0.7)`,
          speedX,
          speedY,
        ),
      );
    }
  }

  requestAnimationFrame(drawScatteredBalls);
}
