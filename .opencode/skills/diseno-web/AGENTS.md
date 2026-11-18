## Componente de autenticación (login)

**Archivos:** `login.html`, `login.css`, `login.js`, `auth-constants.js`

**Descripción:** Componente de inicio de sesión con correo y contraseña renderizado en `<dialog>`. Validación de credenciales antes del envío, manejo de errores genéricos y restauración de sesión desde `sessionStorage`.

**Medidas de seguridad aplicadas:**
- Renderizado mediante `textContent` (previene XSS).
- `autocomplete="email"` / `autocomplete="current-password"` y `minlength="8"` en inputs.
- Mensajes de error genéricos (no revela si el correo existe → evita enumeración de usuarios).
- Contraseña con toggle mostrar/ocultar y etiquetas `aria-label` (accesibilidad).
- Mensajes de error con `role="alert"` y `aria-live="polite"`.
- Sesión en `sessionStorage` (solo pestaña actual) en vez de `localStorage` (reduce exposición vía XSS).
- Token generado con `crypto.randomUUID()` y TTL de 30 minutos.
- Validación de formato de correo y longitud de contraseña (8-128 caracteres).
- **Rate limiting:** máximo 5 intentos fallidos por correo en ventana de 15 min, con bloqueo temporal y mensaje sin revelar existencia de usuario.
- Latencia de red constante (600 ms) para mitigar timing attacks básicos.
- Simulación de credenciales (`usuario@ejemplo.com` / `Password123`); en producción reemplazar por llamada HTTPS al backend y cookies `httpOnly` + `SameSite`.

## Orquestación Automática de Agentes y Recursos
		- Cuando el usuario solicite revisiones de seguridad, invoca automáticamente al subagente `@security-auditor`
		- Cuando el usuario pida cambios en la interfaz o componentes React, aplica el conocimiento de la skill `/frontend-design`
		- Cuando se generen nuevos módulos de código, invoca al especialista en documentación para actualizar la guía
