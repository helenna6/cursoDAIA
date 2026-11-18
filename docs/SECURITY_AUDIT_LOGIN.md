# Auditoría de seguridad — Componente de inicio de sesión

Archivos revisados:
- `src/core/auth-constants.js`
- `src/services/auth.js`
- `src/components/login.js`
- `indexPrueba.html` (integración y estilos del componente de login)

## Hallazgos y mitigaciones aplicadas

| Riesgo | Mitigación implementada |
|--------|-------------------------|
| Almacenar contraseñas/tokens en `localStorage` (expone a XSS) | La sesión se mantiene en **memoria** y solo se persiste en `sessionStorage` (ámbito de pestaña). No se guarda la contraseña. |
| Contraseña en texto claro en pantalla | Input `type="password"` con botón de alternar visibilidad (`type="text"`/`password`). |
| Autocomplete deshabilitado incorrectamente (`autocomplete="off"`) | Se usa `autocomplete="email"` y `autocomplete="current-password"` para gestores de contraseñas. |
| Envío de credenciales sin validación | Validación de formato de correo (`EMAIL_REGEX`) y longitud de contraseña (`PASSWORD_MIN_LENGTH`/`MAX_LENGTH`) antes del envío. |
| Enumeración de usuarios (revelar si el correo existe) | Mensaje de error **genérico** (`AUTH_MESSAGES.CREDENTIALS_INVALID`) independientemente de qué campo falle. |
| XSS por inyección de HTML en mensajes de error | Se usa exclusivamente `textContent`, nunca `innerHTML`. |
| Sesión infinita | `SESSION_TTL_MS` (30 min) con comprobación en `restoreSession()` y evento `SESSION_EXPIRED`. |
| Registro de contraseñas en consola | No se loguean credenciales ni tokens; solo mensajes de error genéricos y errores de almacenamiento. |
| CSRF en peticiones al backend | N/A (simulación local). En producción: usar `fetch` con `credentials: 'include'` y cookies `httpOnly`, `SameSite=Strict`, `Secure` sobre HTTPS. |
| Exposición del token al script malicioso | El token no se expone en URL ni se imprime; `getToken()` devuelve `null` si no hay sesión válida. |

## Limitaciones conocidas (pendiente de backend real)

1. **No hay backend HTTPS real**: `AuthService.login` simula la validación. Reemplazar por `fetch` a endpoint `/auth/login` sobre HTTPS.
2. **Token en sesión, no en cookie httpOnly**: Por ser frontend puro sin servidor, el token vive en memoria/sessionStorage. En producción con backend, el servidor debería emitir cookie `httpOnly; SameSite=Strict; Secure` y el cliente no debería manejar el token directamente.
3. **Sin límite de intentos (brute force)**: No hay rate limiting del lado del cliente. Debe implementarse en el servidor (captcha, bloqueo temporal por IP/correo).
4. **`sessionStorage` es vulnerable a XSS en la misma pestaña**: Es el compromiso aceptado para un frontend sin backend. Para máxima seguridad, usar cookies httpOnly mediante backend.

## Recomendaciones para producción

- Exigir **HTTPS** (HSTS).
- Cookies de sesión: `httpOnly`, `Secure`, `SameSite=Strict`.
- Rate limiting y bloqueo de cuenta tras N fallos.
- Política de contraseñas robusta (mayúsculas, números, símbolos) y verificación contra contraseñas comprometidas (HaveIBeenPwned API).
- MFA/2FA opcional.
- Audit log de intentos de acceso.
