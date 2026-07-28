import { ctx } from "./canvas.js";

export default class Ball {
  constructor(x, y, size, r, g, b, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;

    this.r = r;
    this.g = g;
    this.b = b;

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
    ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;
    ctx.fill();
  }
}
