import { Ball } from "./ball.js";
import { analyzer, dataArray, isPlaying } from "./audio.js";
import { canvas, ctx } from "./canvas.js";
import { averageBins } from "./utils.js";

const balls = [];

export function animate() {
  if (!isPlaying) return;

  ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
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

export function drawScatteredBalls() {
  if (!isPlaying) return;

  analyzer.getByteFrequencyData(dataArray);

  const bass = dataArray[5];

  if (bass > 115) {
    const impactX = Math.random() * canvas.width;
    const impactY = Math.random() * canvas.height;

    for (let i = 0; i < 20; i++) {
      const bassEnergy = averageBins(dataArray, 0, 15);
      const vocalEnergy = averageBins(dataArray, 15, 50);
      const trebleEnergy = averageBins(dataArray, 50, 128);

      const r = bassEnergy;
      const g = vocalEnergy;
      const b = trebleEnergy;

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2;

      const speedX = Math.cos(angle) * speed;
      const speedY = Math.sin(angle) * speed;

      balls.push(
        new Ball(
          impactX,
          impactY,
          Math.random() * (bass / 100),
          r,
          g,
          b,
          speedX,
          speedY,
        ),
      );
    }
  }

  requestAnimationFrame(drawScatteredBalls);
}

export function clearBalls() {
  balls.length = 0;
}
