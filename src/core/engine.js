// Motor del juego: game loop con requestAnimationFrame + acumulador de delta time
import { TICK_MS } from './constants.js';

let lastTime = 0;
let accumulator = 0;
let isRunning = false;
let gameLoopId = null;
let tickCallback = null;

export function initEngine(onTick) {
  tickCallback = onTick;
}

export function startEngine() {
  if (isRunning) return;
  isRunning = true;
  lastTime = performance.now();
  accumulator = 0;
  requestAnimationFrame(gameLoop);
}

export function stopEngine() {
  isRunning = false;
  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId);
    gameLoopId = null;
  }
}

function gameLoop(timestamp) {
  if (!isRunning) return;

  const delta = timestamp - lastTime;
  lastTime = timestamp;

  accumulator += delta;

  while (accumulator >= TICK_MS) {
    tickCallback();
    accumulator -= TICK_MS;
  }

  gameLoopId = requestAnimationFrame(gameLoop);
}

export function getEngineState() {
  return { isRunning, accumulator, lastTime };
}