// Renderizado en Canvas 2D: serpiente, comida, grid, score
import { GRID_SIZE, CELL_SIZE, COLORS } from '../core/constants.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

export function draw() {
  const state = window.__snakeState;
  if (!state) return;

  // Fondo del canvas
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar grid (opcional, sutil)
  drawGrid();

  // Dibujar comida
  drawFood(state.food);

  // Dibujar serpiente
  drawSnake(state.snake);
}

function drawGrid() {
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE, 0);
    ctx.lineTo(i * CELL_SIZE, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * CELL_SIZE);
    ctx.lineTo(canvas.width, i * CELL_SIZE);
    ctx.stroke();
  }
}

function drawFood(food) {
  const glow = COLORS.foodGlow;
  ctx.shadowColor = glow;
  ctx.shadowBlur = 12;
  ctx.fillStyle = COLORS.food;
  ctx.beginPath();
  ctx.arc(
    food.x * CELL_SIZE + CELL_SIZE / 2,
    food.y * CELL_SIZE + CELL_SIZE / 2,
    CELL_SIZE / 2 - 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawSnake(snake) {
  snake.forEach((segment, index) => {
    const isHead = index === 0;
    ctx.fillStyle = isHead ? COLORS.snakeHead : index % 2 === 0 ? COLORS.snakeBody : COLORS.snakeBodyAlt;

    // Esquinas redondeadas para el cuerpo
    const x = segment.x * CELL_SIZE + 2;
    const y = segment.y * CELL_SIZE + 2;
    const size = CELL_SIZE - 4;

    if (isHead) {
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 4);
      ctx.fill();
    } else {
      ctx.fillRect(x, y, size, size);
    }
  });
}

export function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}