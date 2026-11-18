// Constantes globales de configuración del juego
export const GRID_SIZE = 20;          // 20x20 celdas
export const CELL_SIZE = 20;          // 20px por celda (400px / 20 = 20)
export const CANVAS_SIZE = 400;       // Canvas 400x400
export const TICK_MS = 120;           // Velocidad: 120ms por movimiento (~8.33 FPS lógico)

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

export const KEY_MAP = {
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
  ArrowLeft: DIRECTIONS.LEFT,
  ArrowRight: DIRECTIONS.RIGHT,
  KeyW: DIRECTIONS.UP,
  KeyS: DIRECTIONS.DOWN,
  KeyA: DIRECTIONS.LEFT,
  KeyD: DIRECTIONS.RIGHT
};

export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  GAMEOVER: 'gameover'
};

// Colores del juego (dark mode)
export const COLORS = {
  background: '#111111',
  grid: '#333333',
  snakeHead: '#00d4aa',
  snakeBody: '#00b894',
  snakeBodyAlt: '#00cec9',
  food: '#e94560',
  foodGlow: '#ff9a9e'
};