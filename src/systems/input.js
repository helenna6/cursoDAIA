// Sistema de entrada de teclado: flechas y WASD, bloqueo de giros 180°
import { KEY_MAP, DIRECTIONS } from '../core/constants.js';

export class InputHandler {
  constructor(onDirectionChange) {
    this.onDirectionChange = onDirectionChange;
    this.keysPressed = new Set();
    this.pendingDirection = null;
    this.isBound = false;
  }

  bind() {
    if (this.isBound) return;
    this.isBound = true;
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  unbind() {
    if (!this.isBound) return;
    this.isBound = false;
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(event) {
    // Prevenir scroll con flechas
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }

    const direction = KEY_MAP[event.code] || KEY_MAP[event.key];
    if (!direction) return;

    // Cola de direcciones para evitar pérdida de input rápido
    this.pendingDirection = direction;
  }

  // Se llama en cada tick para procesar la dirección pendiente
  update(currentDirection) {
    if (!this.pendingDirection) return currentDirection;

    const next = this.pendingDirection;
    this.pendingDirection = null;

    // Bloquear giro 180° (opuesto al movimiento actual)
    if (currentDirection.x !== 0 && next.x === -currentDirection.x) {
      return currentDirection;
    }
    if (currentDirection.y !== 0 && next.y === -currentDirection.y) {
      return currentDirection;
    }

    return next;
  }
}