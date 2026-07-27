import { playAudio, resetAudio } from "./audio.js";
import { animate, drawScatteredBalls } from "./scatteredBalls.js";
import { clearCanvas } from "./canvas.js";
import { clearBalls } from "./scatteredBalls.js";

const playBtn = document.getElementById("play-btn");
const resetBtn = document.getElementById("reset-btn");

playBtn.addEventListener("click", () => {
  const started = playAudio();

  if (started) {
    animate();
    drawScatteredBalls();
  }
});

resetBtn.addEventListener("click", () => {
  resetAudio();
  clearCanvas();
  clearBalls();

  title.style.display = "block";
  playBtn.textContent = "Play";
});
