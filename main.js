import { playAudio, resetAudio } from "./audio.js";
import { startAnimation, stopAnimation, clearBalls } from "./scatteredBalls.js";
import { clearCanvas } from "./canvas.js";

// const playBtn = document.getElementById("play-btn");
// const resetBtn = document.getElementById("reset-btn");
// const title = document.querySelector(".title");
const genreCards = document.querySelectorAll(".genre-card");

// playBtn.addEventListener("click", () => {
//   const playing = playAudio();

//   if (playing) {
//     // Start the animation when audio is playing
//     startAnimation();
//   } else {
//     // Stop the animation when audio is paused
//     stopAnimation();
//   }
// });

// resetBtn.addEventListener("click", () => {
//   resetAudio();
//   clearCanvas();
//   clearBalls();

//   playBtn.textContent = "Play";
//   title.style.display = "block";
// });

genreCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    const selectedGenre = event.currentTarget.dataset.genre;

    console.log(`Selected genre: ${selectedGenre}`);
  });
});
