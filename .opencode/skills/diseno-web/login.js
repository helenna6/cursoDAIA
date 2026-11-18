// Componente de inicio de sesión con correo y contraseña.
// Renderizado mediante textContent (previene XSS).
// Validación de credenciales antes del envío.
// Sesión en sessionStorage (solo pestaña actual).
import {
  AUTH_STORAGE_KEY,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  EMAIL_REGEX,
  SESSION_TTL_MS,
  AUTH_EVENTS,
  AUTH_MESSAGES
} from './auth-constants.js';

const LOGIN_HTML = `
  <dialog class="login-dialog" id="loginDialog">
    <form class="login-form" id="loginForm" novalidate>
      <h2 class="login-title" id="loginTitle">Iniciar sesión</h2>
      <div class="login-field">
        <label for="loginEmail">Correo electrónico</label>
        <input
          type="email"
          id="loginEmail"
          name="email"
          autocomplete="email"
          required
          placeholder="tucorreo@ejemplo.com"
        >
      </div>
      <div class="login-field password-field">
        <label for="loginPassword">Contraseña</label>
        <div class="password-input-wrapper">
          <input
            type="password"
            id="loginPassword"
            name="password"
            autocomplete="current-password"
            required
            placeholder="••••••••"
            minlength="8"
          >
          <button type="button" class="btn-toggle-password" id="togglePassword" aria-label="Mostrar contraseña">
            <span class="toggle-icon" aria-hidden="true">👁️</span>
          </button>
        </div>
      </div>
      <div class="login-message" id="loginError" role="alert" aria-live="polite"></div>
      <button type="button" class="btn-close" id="loginClose">Cerrar</button>
    </form>
  </dialog>
  <button class="btn-login-open" id="loginOpenBtn">Iniciar sesión</button>
`;

const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

class AuthError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

class AuthService {
  constructor() {
    this._token = null;
    this._expiresAt = null;
    this._userEmail = null;
    this._listeners = [];
    this._failedAttempts = new Map();
  }

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
    try { sessionStorage.removeItem(AUTH_STORAGE_KEY); } catch (e) {}
  }

  _persistSession(token, email, expiresAt) {
    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, email, expiresAt }));
    } catch (e) {}
  }

  async login(email, password) {
    const credentials = this.validateCredentials(email, password);
    const key = credentials.email;
    const now = Date.now();

    // Rate limiting contra fuerza bruta
    const record = this._failedAttempts.get(key) || { count: 0, firstAt: now };
    if (record.count >= RATE_LIMIT_MAX_ATTEMPTS && now - record.firstAt < RATE_LIMIT_WINDOW_MS) {
      const restante = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - record.firstAt)) / 1000);
      throw new AuthError(`Demasiados intentos fallidos. Intenta de nuevo en ${restante} segundos.`, 'rate_limited');
    }
    if (record.count >= RATE_LIMIT_MAX_ATTEMPTS && now - record.firstAt >= RATE_LIMIT_WINDOW_MS) {
      record.count = 0;
      record.firstAt = now;
    }

    // Latencia de red constante (mitiga timing attacks básicos)
    await new Promise(resolve => setTimeout(resolve, 600));

    // === SIMULACIÓN === En producción validar contra el backend mediante HTTPS
    const isValid =
      credentials.email === 'usuario@ejemplo.com' &&
      credentials.password === 'Password123';
    // ==================

    if (!isValid) {
      record.count += 1;
      this._failedAttempts.set(key, record);
      this._notify(AUTH_EVENTS.LOGIN_FAILURE, { reason: 'invalid_credentials' });
      throw new AuthError(AUTH_MESSAGES.CREDENTIALS_INVALID, 'invalid_credentials');
    }

    this._failedAttempts.delete(key);
    this._token = 'sess_' + crypto.randomUUID();
    this._userEmail = credentials.email;
    this._expiresAt = Date.now() + SESSION_TTL_MS;
    this._persistSession(this._token, credentials.email, this._expiresAt);

    this._notify(AUTH_EVENTS.LOGIN_SUCCESS, { email: credentials.email });
    return { ok: true, token: this._token, email: credentials.email };
  }

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
    } catch (e) {
      this._clearSession();
      return false;
    }
  }

  logout() {
    const wasAuthenticated = this.isAuthenticated();
    this._clearSession();
    if (wasAuthenticated) this._notify(AUTH_EVENTS.LOGOUT, {});
    return { ok: true };
  }
}

export const authService = new AuthService();

export class LoginComponent {
  constructor({ containerSelector = 'body', auth = authService } = {}) {
    this._container = document.querySelector(containerSelector);
    this._auth = auth;
    this._elements = {};
    this._boundHandlers = {};
    this._unsubscribe = null;
  }

  mount() {
    if (this._container) {
      this._container.insertAdjacentHTML('beforeend', LOGIN_HTML);
    }
    this._cacheElements();
    this._bindEvents();
    this._subscribeAuth();
  }

  unmount() {
    const dialog = this._elements.dialog;
    if (dialog) dialog.close();
    this._unbindEvents();
    if (this._unsubscribe) this._unsubscribe();
  }

  _cacheElements() {
    const ids = [
      'loginDialog', 'loginForm', 'loginEmail', 'loginPassword',
      'loginError', 'loginBtn', 'loginClose', 'loginOpenBtn', 'togglePassword'
    ];
    ids.forEach(id => {
      this._elements[id] = document.getElementById(id);
    });
    this._elements.passwordWrapper = this._elements.loginPassword
      ? this._elements.loginPassword.closest('.password-input-wrapper')
      : null;
  }

  _bindEvents() {
    const { loginForm, loginClose, loginOpenBtn, togglePassword } = this._elements;

    this._boundHandlers.onSubmit = this._onSubmit.bind(this);
    this._boundHandlers.onClose = this._onClose.bind(this);
    this._boundHandlers.onOpen = this._onOpen.bind(this);
    this._boundHandlers.onToggle = this._onTogglePassword.bind(this);
    this._boundHandlers.onDialogCancel = this._onDialogCancel.bind(this);

    if (loginForm) loginForm.addEventListener('submit', this._boundHandlers.onSubmit);
    if (loginClose) loginClose.addEventListener('click', this._boundHandlers.onClose);
    if (loginOpenBtn) loginOpenBtn.addEventListener('click', this._boundHandlers.onOpen);
    if (togglePassword) togglePassword.addEventListener('click', this._boundHandlers.onToggle);
    if (this._elements.dialog) {
      this._elements.dialog.addEventListener('cancel', this._boundHandlers.onDialogCancel);
    }
  }

  _unbindEvents() {
    const { loginForm, loginClose, loginOpenBtn, togglePassword } = this._elements;
    if (loginForm) loginForm.removeEventListener('submit', this._boundHandlers.onSubmit);
    if (loginClose) loginClose.removeEventListener('click', this._boundHandlers.onClose);
    if (loginOpenBtn) loginOpenBtn.removeEventListener('click', this._boundHandlers.onOpen);
    if (togglePassword) togglePassword.removeEventListener('click', this._boundHandlers.onToggle);
    if (this._elements.dialog) {
      this._elements.dialog.removeEventListener('cancel', this._boundHandlers.onDialogCancel);
    }
  }

  _subscribeAuth() {
    this._unsubscribe = this._auth.onAuthChange((event, payload) => {
      if (event === AUTH_EVENTS.LOGIN_SUCCESS) {
        this._elements.dialog?.close();
        this._clearError();
        this._setLoading(false);
      } else if (event === AUTH_EVENTS.LOGIN_FAILURE) {
        this._setLoading(false);
        this._showError(AUTH_MESSAGES.CREDENTIALS_INVALID);
      } else if (event === AUTH_EVENTS.SESSION_EXPIRED) {
        this._showError(AUTH_MESSAGES.SESSION_EXPIRED);
      } else if (event === AUTH_EVENTS.LOGOUT) {
        this._clearError();
      }
    });
  }

  async _onSubmit(event) {
    event.preventDefault();
    const email = this._elements.loginEmail.value;
    const password = this._elements.loginPassword.value;

    this._clearError();
    this._setLoading(true);

    try {
      await this._auth.login(email, password);
    } catch (error) {
      this._showError(error.message || AUTH_MESSAGES.CREDENTIALS_INVALID);
    } finally {
      this._setLoading(false);
    }
  }

  _onOpen() {
    this._clearError();
    this._elements.loginEmail.value = '';
    this._elements.loginPassword.value = '';
    this._elements.loginEmail.focus();
    this._elements.dialog?.showModal();
  }

  _onClose() {
    this._elements.dialog?.close();
  }

  _onDialogCancel() {
    this._elements.dialog?.close();
  }

  _onTogglePassword() {
    const input = this._elements.loginPassword;
    const icon = this._elements.togglePassword.querySelector('.toggle-icon');
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    input.focus();
    if (icon) icon.textContent = isPassword ? '🙈' : '👁️';
    this._elements.togglePassword.setAttribute(
      'aria-label',
      isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
    );
  }

  _setLoading(loading) {
    const btn = this._elements.loginBtn;
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? 'Verificando…' : 'Iniciar sesión';
  }

  _showError(message) {
    const errorEl = this._elements.loginError;
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.hidden = false;
    errorEl.setAttribute('aria-hidden', 'false');
  }

  _clearError() {
    const errorEl = this._elements.loginError;
    if (!errorEl) return;
    errorEl.textContent = '';
    errorEl.hidden = true;
    errorEl.setAttribute('aria-hidden', 'true');
  }

  isAuthenticated() {
    return this._auth.isAuthenticated();
  }
}

export function initLogin({ containerSelector = 'body' } = {}) {
  const login = new LoginComponent({ containerSelector });
  login.mount();
  return login;
}
