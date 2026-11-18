// Gestión de estado del juego: serpiente, comida, score, estado
import { GRID_SIZE, CELL_SIZE, CANVAS_SIZE, GAME_STATES } from '../core/constants.js';

export class GameState {
  constructor() {
    this.state = GAME_STATES.MENU;
    this.snake = [];
    this.direction = { x: 0, y: 0 };
    this.nextDirection = { x: 0, y: 0 };
    this.food = { x: 0, y: 0 };
    this.score = 0;
    this.highScore = 0;
    this.gameOver = false;
  }

  // Iniciar un nuevo juego
  start() {
    const startX = Math.floor(GRID_SIZE / 2);
    const startY = Math.floor(GRID_SIZE / 2);
    this.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY }
    ];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.score = 0;
    this.gameOver = false;
    this.state = GAME_STATES.PLAYING;
    this.spawnFood();
  }

  // Colocar comida en una celda vacía
  spawnFood() {
    let valid = false;
    while (!valid) {
      this.food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      valid = !this.snake.some(seg => seg.x === this.food.x && seg.y === this.food.y);
    }
  }

  // Avanzar un tick del juego
  tick() {
    if (this.state !== GAME_STATES.PLAYING) return;

    this.direction = this.nextDirection;

    const head = { ...this.snake[0] };
    head.x += this.direction.x;
    head.y += this.direction.y;

    // Comer comida
    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.unshift(head);
      this.score += 10;
      this.spawnFood();
    } else {
      this.snake.unshift(head);
      this.snake.pop();
    }
  }

  setDirection(direction) {
    if (this.state !== GAME_STATES.PLAYING) return;
    this.nextDirection = direction;
  }

  getSnapshot() {
    return {
      state: this.state,
      snake: [...this.snake],
      food: { ...this.food },
      score: this.score,
      gameOver: this.gameOver
    };
  }

  reset() {
    this.state = GAME_STATES.MENU;
    this.snake = [];
    this.direction = { x: 0, y: 0 };
    this.nextDirection = { x: 0, y: 0 };
    this.score = 0;
    this.gameOver = false;
  }
}