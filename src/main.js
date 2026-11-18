// Entry point: inicializa todo y conecta los sistemas
import { initEngine, startEngine, stopEngine } from '../core/engine.js';
import { InputHandler } from '../systems/input.js';
import { GameState } from '../systems/state.js';
import { checkCollision } from '../systems/collisions.js';
import { draw } from '../systems/render.js';
import { loadHighScore, saveHighScore } from '../services/storage.js';
import { GAME_STATES } from '../core/constants.js';

// Elementos DOM
const startOverlay = document.getElementById('startOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const finalScoreEl = document.getElementById('finalScore');

// Instancias globales
const gameState = new GameState();
const inputHandler = new InputHandler(direction => gameState.setDirection(direction));

// Exponer estado para render.js
window.__snakeState = gameState;

// Inicializar high score
highScoreEl.textContent = loadHighScore();

// Inicializar engine con callback de tick
initEngine(() => {
  // 1. Procesar input pendiente
  gameState.setDirection(inputHandler.update(gameState.direction));

  // 2. Avanzar tick lógico
  gameState.tick();

  // 3. Verificar colisiones
  if (checkCollision(gameState)) {
    handleGameOver();
    return;
  }

  // 4. Renderizar
  draw();
});

// Eventos de botones
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

function startGame() {
  startOverlay.style.display = 'none';
  gameOverOverlay.style.display = 'none';
  gameState.start();
  scoreEl.textContent = gameState.score;
  inputHandler.bind();
  startEngine();
}

function handleGameOver() {
  gameState.state = GAME_STATES.GAMEOVER;
  gameState.gameOver = true;
  stopEngine();
  inputHandler.unbind();

  // Actualizar y guardar high score
  const newHighScore = saveHighScore(gameState.score);
  highScoreEl.textContent = newHighScore;

  finalScoreEl.textContent = gameState.score;
  gameOverOverlay.style.display = 'flex';
  gameOverOverlay.classList.add('active');
}

// Inicial: mostrar overlay de inicio
startOverlay.style.display = 'flex';
startOverlay.classList.add('active');