// Persistencia de high score en localStorage
const STORAGE_KEY = 'snake_high_score';

export function loadHighScore() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    console.error('Error al leer high score:', error.message);
    return 0;
  }
}

export function saveHighScore(score) {
  try {
    const current = loadHighScore();
    if (score > current) {
      localStorage.setItem(STORAGE_KEY, String(score));
      return score;
    }
    return current;
  } catch (error) {
    console.error('Error al guardar high score:', error.message);
    return loadHighScore();
  }
}