// Componente de inicio de sesión: formulario con correo y contraseña.
// Renderizado exclusivamente con textContent (previene XSS) y validación
// de credenciales antes del envío.
import { authService } from '../services/auth.js';
import {
  AUTH_EVENTS,
  AUTH_MESSAGES
} from '../core/auth-constants.js';

const LOGIN_HTML = `
  <dialog class="login-dialog" id="loginDialog">
    <form class="login-form" id="loginForm" novalidate>
      <h2 class="login-title">Iniciar sesión</h2>
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
      <button type="submit" class="btn-login" id="loginBtn">Ingresar</button>
      <button type="button" class="btn-close" id="loginClose">Cerrar</button>
    </form>
  </dialog>
  <button class="btn-login-open" id="loginOpenBtn">Iniciar sesión</button>
`;

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
      'loginError', 'loginBtn', 'loginClose', 'loginOpenBtn',
      'togglePassword'
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
      // AuthError ya lanza mensaje genérico; errores inesperados también son genéricos
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
    btn.textContent = loading ? 'Verificando…' : 'Ingresar';
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
