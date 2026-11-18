// Constantes de autenticación y validación de credenciales
export const AUTH_STORAGE_KEY = 'snake_auth_session';
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutos de sesión

export const AUTH_EVENTS = {
  LOGIN_SUCCESS: 'auth:login-success',
  LOGIN_FAILURE: 'auth:login-failure',
  LOGOUT: 'auth:logout',
  SESSION_EXPIRED: 'auth:session-expired'
};

// Mensajes genéricos (evitan enumerar usuarios existentes)
export const AUTH_MESSAGES = {
  CREDENTIALS_INVALID: 'Correo o contraseña incorrectos.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
  NETWORK_ERROR: 'Error de conexión. Intenta de nuevo más tarde.'
};
