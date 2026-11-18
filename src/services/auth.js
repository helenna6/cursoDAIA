// Servicio de autenticación: validación de credenciales y gestión de sesión.
// Nota: en entorno real el token debería venir del servidor y almacenarse
// en cookies httpOnly + SameSite. Aquí se mantiene en memoria (sesión solo)
// para evitar exposición vía XSS a través de localStorage.
import {
  AUTH_STORAGE_KEY,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  EMAIL_REGEX,
  SESSION_TTL_MS,
  AUTH_EVENTS,
  AUTH_MESSAGES
} from '../core/auth-constants.js';

class AuthError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutos

export class AuthService {
  constructor() {
    this._token = null;
    this._expiresAt = null;
    this._userEmail = null;
    this._listeners = [];
    this._failedAttempts = new Map();
  }

  // Valida formato de correo y contraseña antes de enviarlos
  validateCredentials(email, password) {
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new AuthError(AUTH_MESSAGES.CREDENTIALS_INVALID, 'invalid_input');
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      throw new AuthError(AUTH_MESSAGES.CREDENTIALS_INVALID, 'invalid_email');
    }

    if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
      throw new AuthError(
        `La contraseña debe tener entre ${PASSWORD_MIN_LENGTH} y ${PASSWORD_MAX_LENGTH} caracteres.`,
        'invalid_password'
      );
    }

    return { email: trimmedEmail, password };
  }

  isAuthenticated() {
    return Boolean(this._token && this._expiresAt && Date.now() < this._expiresAt);
  }

  getToken() {
    return this.isAuthenticated() ? this._token : null;
  }

  getUserEmail() {
    return this.isAuthenticated() ? this._userEmail : null;
  }

  onAuthChange(listener) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
    };
  }

  _notify(event, payload) {
    this._listeners.forEach(listener => listener(event, payload));
  }

  _clearSession() {
    this._token = null;
    this._expiresAt = null;
    this._userEmail = null;
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Error al limpiar sesión:', error.message);
    }
  }

  _persistSession(token, email, expiresAt) {
    try {
      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ token, email, expiresAt })
      );
    } catch (error) {
      console.error('Error al persistir sesión:', error.message);
    }
  }

  // Simula una llamada de API. Reemplazar por fetch real al backend.
  async login(email, password) {
    const credentials = this.validateCredentials(email, password);
    const key = credentials.email;
    const now = Date.now();

    // Rate limiting contra fuerza bruta
    const record = this._failedAttempts.get(key) || { count: 0, firstAt: now };
    if (record.count >= RATE_LIMIT_MAX_ATTEMPTS && now - record.firstAt < RATE_LIMIT_WINDOW_MS) {
      const restante = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - record.firstAt)) / 1000);
      throw new AuthError(
        `Demasiados intentos fallidos. Intenta de nuevo en ${restante} segundos.`,
        'rate_limited'
      );
    }
    if (record.count >= RATE_LIMIT_MAX_ATTEMPTS && now - record.firstAt >= RATE_LIMIT_WINDOW_MS) {
      record.count = 0;
      record.firstAt = now;
    }

    // Simulación de latencia de red (constante, evita timing attacks básicos)
    await new Promise(resolve => setTimeout(resolve, 600));

    // === SIMULACIÓN === En producción validar contra el backend mediante HTTPS
    const isValid =
      credentials.email === 'usuario@ejemplo.com' &&
      credentials.password === 'Password123';
    // ==================

    if (!isValid) {
      record.count += 1;
      this._failedAttempts.set(key, record);
      // Mensaje genérico: no revela si el correo existe (evita enumeración)
      this._notify(AUTH_EVENTS.LOGIN_FAILURE, { reason: 'invalid_credentials' });
      throw new AuthError(AUTH_MESSAGES.CREDENTIALS_INVALID, 'invalid_credentials');
    }

    // Éxito: limpiar intentos fallidos y crear sesión
    this._failedAttempts.delete(key);
    this._token = 'sess_' + crypto.randomUUID();
    this._userEmail = credentials.email;
    this._expiresAt = Date.now() + SESSION_TTL_MS;
    this._persistSession(this._token, credentials.email, this._expiresAt);

    this._notify(AUTH_EVENTS.LOGIN_SUCCESS, { email: credentials.email });
    return { ok: true, token: this._token, email: credentials.email };
  }

  // Intenta restaurar sesión desde sessionStorage (solo pestaña actual)
  restoreSession() {
    try {
      const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data || !data.token || !data.expiresAt) return false;
      if (Date.now() >= data.expiresAt) {
        this._clearSession();
        this._notify(AUTH_EVENTS.SESSION_EXPIRED, {});
        return false;
      }
      this._token = data.token;
      this._userEmail = data.email;
      this._expiresAt = data.expiresAt;
      return true;
    } catch (error) {
      this._clearSession();
      return false;
    }
  }

  logout() {
    const wasAuthenticated = this.isAuthenticated();
    this._clearSession();
    if (wasAuthenticated) {
      this._notify(AUTH_EVENTS.LOGOUT, {});
    }
    return { ok: true };
  }
}

export const authService = new AuthService();
