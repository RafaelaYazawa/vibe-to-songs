import { ctx } from "./canvas.js";

let audioCtx;
let audioSource;
let analyzer;
let isPlaying;
let bufferLength;
let dataArray;
let audioElement;

const audio = new Audio("./audios/JENNIE -Seoul_City.mp3");

export function initAudio() {
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

export function playAudio() {
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

    return true;
  }
  audioElement.pause();
  isPlaying = false;

  return false;
}

export function resetAudio() {
  if (!audio) {
    console.error("Audio element not found");
    return;
  }

  audio.currentTime = 0;
  isPlaying = false;
}

export { analyzer, dataArray };
