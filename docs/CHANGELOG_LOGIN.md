# Cambios — Componente de inicio de sesión (correo + contraseña)

## Archivos nuevos

| Archivo | Propósito |
|---------|-----------|
| `src/core/auth-constants.js` | Constantes de autenticación: claves de almacenamiento, longitud mínima/máxima de contraseña, regex de correo, TTL de sesión, eventos y mensajes genéricos de error. |
| `src/services/auth.js` | `AuthService`: validación de credenciales, login (simulado), restauración de sesión desde `sessionStorage`, cierre de sesión, suscripción a cambios de estado y notificaciones de evento. |
| `src/components/login.js` | `LoginComponent`: renderizado del formulario en un `<dialog>`, alternar visibilidad de contraseña, validación client-side, mensajes de error vía `textContent` (anti-XSS), estados de carga y accesibilidad (ARIA). |
| `docs/SECURITY_AUDIT_LOGIN.md` | Auditoría de seguridad del componente generado. |

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `indexPrueba.html` | Se agregó botón "Iniciar sesión" (`.btn-login-open`), estilos CSS del componente de login y un `<script type="module">` que importa e inicializa `initLogin`. El juego original se conserva intacto. |
| `index.html` | Sin cambios (juego original). |

## Convenciones seguidas (según `AGENTS.md`)

- JS modular ES6+ con `import/export`.
- Nombres `camelCase` para funciones/variables, `PascalCase` para clases, `UPPER_SNAKE_CASE` para constantes.
- Sin uso de `any` (no aplica, JS puro).
- Mensajes de error en español.
- Estilos con propiedades CSS personalizadas y `clamp()` para responsive.
- `requestAnimationFrame` no aplica (componente de UI basado en eventos).

## Cómo usarlo

Al cargar `index.html` aparece el botón "Iniciar sesión". Al hacer clic se abre el modal de login con campos de correo y contraseña. Las credenciales de prueba del simulador son `usuario@ejemplo.com` / `Password123`.
