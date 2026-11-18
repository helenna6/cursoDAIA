// Detección de colisiones: límites del canvas y auto-colisión
import { GRID_SIZE } from '../core/constants.js';

export function checkWallCollision(head) {
  return head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
}

export function checkSelfCollision(snake) {
  const head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

export function checkCollision(state) {
  const head = state.snake[0];
  if (checkWallCollision(head)) return true;
  if (checkSelfCollision(state.snake)) return true;
  return false;
}