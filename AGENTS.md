# AGENTS.md

Guías técnicas optimizadas para agentes de IA y desarrolladores
---proyecto web interactivo/minijuego HTML5/CSS3/JS---

## Overview

Proyecto de minijuego/interactivo desarrollado con **HTML5 (Canvas/DOM)**, **CSS3 moderno** (Flexbox, Grid, Custom Properties) y **JavaScript Vanilla ES6+ modular** o **TypeScript estricto**.

**Propósito:** Brindar una base estructurada y mantenible para desarrollo de juegos/web interactivos en el navegador, estableciendo estándares claros de código, rendimiento y arquitectura.

**Tecnologías principales:**
- HTML5 Canvas 2D (o DOM para UI) para renderizado
- CSS3 con Flexbox/Grid, variables CSS (`--color-primary`, `--spacing-base`, etc.)
- JavaScript ES6+ modular (`import/export`) o TypeScript con tipos estrictos
- `requestAnimationFrame` para bucles de animación y juego
- Herramientas de build: Vite, esbuild o Rollup para producción

---

## Repository Structure

Organización clara de carpetas para separar responsabilidades:

```
cursoDAIA/
├─ package.json          # Metadatos y scripts npm
├─ tsconfig.json         # Configuración TypeScript (si se usa)
├─ index.html            # Punto de entrada principal
├─ src/
│  ├─ main.js / main.ts   # Entry point del juego
│  ├─ core/
│  │  ├─ engine.js      # Game loop, requestAnimationFrame wrapper
│  │  └─ constants.js   # Constantes globales, configuración
│  ├─ systems/
│  │  ├─ render.js      # Motor de renderizado (Canvas/DOM)
│  │  ├─ input.js       # Manejador de teclado/mouse/touch
│  │  ├─ audio.js       # Gestor de sonido (Web Audio API)
│  │  └─ state.js       # Gestor de estado del juego
│  ├─ entities/
│  │  ├─ player.js     # Entidad jugador
│  │  ├─ enemy.js      # Entidad enemigo
│  │  └─ utils.js      # Utilidades compartidas
│  └─ scenes/
│     ├─ intro.js      # Escena de introducción
│     ├─ level1.js     # Escena/nivel 1
│     └─ gameover.js   # Escena de game over
├─ assets/
│  ├─ images/
│  │  ├─ player.png
│  │  └─ background.jpg
│  ├─ sounds/
│  │  ├─ jump.wav
│  │  └─ music.mp3
│  └─ fonts/
│     └─ pixel-font.ttf
├─ styles/
│  └─ main.css         # Estilos CSS globales
├─ tests/
│  └─ unit/           # Pruebas unitarias (si aplica)
└─ .gitignore
```

---

## Key Commands

Comandos esenciales para desarrollo, validación y build:

| Comando | Descripción |
|---------|-------------|
| `npm install` | Instalar dependencias (typescript, vite, eslint, etc.) |
| `npm run dev` | Iniciar servidor de desarrollo con Vite (hot module replacement) |
| `npm run build` | Generar build de producción (minificado) |
| `npm run lint` | Ejecutar linter (ESLint) para revisar estilo y posible errors |
| `npm run typecheck` | Verificar tipos TypeScript estrictos |
| `npm run test` | Ejecutar pruebas unitarias (Jest o Vitest) |
| `npm run preview` | Previsualizar build de producción localmente |

---

## Development Workflow

Pasos recomendados para implementar nuevas características:

1. **Crear rama feature:** `git checkout -b feature/nueva-caracteristica`
2. **Definir tipos/interface:** En TypeScript, crear interfaces claras para datos del juego (entidades, estado, configuración). **Prohibir el uso de `any`**.
3. **Modularizar lógica:** Separar renderizado, lógica de juego y manejo de entrada en módulos independientes.
4. **Implementar game loop:** Usar `requestAnimationFrame` en `src/core/engine.js`. Evitar `setInterval` o `setTimeout` para animaciones principales.
5. **Añadir estilos:** Actualizar `styles/main.css` con Flexbox/Grid y Custom Properties. No usar `!important` salvo casos extremos.
6. **Probar localmente:** Ejecutar `npm run dev` y verificar comportamiento en navegadores compatibles.
7. **Linter y typecheck:** Ejecutar `npm run lint && npm run typecheck` para asegurar calidad.
8. **Commit con mensaje claro:** Seguir convenciones de commits en español o inglés técnico.
9. **Crear Pull Request:** Describir cambios, nuevo comportamiento y telépruebas realizadas.

---

## Entry Points

Archivos principales de ejecución:

- **`index.html`**: Punto de entrada HTML. Debe incluir `<canvas id="game-canvas"></canvas>` o estructura DOM para UI, y cargar el bundle de producción o desarrollo.
- **`src/main.js`** o **`src/main.ts`**: Module principal que inicializa el juego:
  - Crear instancia del canvas y contexto 2D (o montar UI DOM)
  - Configurar eventos de entrada (`input.js`)
  - Iniciar game loop (`engine.js`)
  - Cargar recursos iniciales (imágenes, sonidos)
- **`src/core/engine.js`**: Bucle principal con `requestAnimationFrame`:
  ```js
  function gameLoop(timestamp) {
    // Actualizar estado
    update(deltaTime);
    // Renderizar
    render();
    // Siguiente frame
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
  ```

---

## Architecture Notes

**Separación de responsabilidades:**

- **Módulos de estado:** `src/systems/state.js` — Gestión centralizada del estado del juego (score, nivel, vidas, pausado). Preferir inmutabilidad o actualizaciones controladas.
- **Renderizado:** `src/systems/render.js` — Todo lo relacionado con dibujo en Canvas (`ctx.fillRect`, `ctx.drawImage`, rutas, gradientes) o manipulación DOM. Islar el motor gráfico de la lógica de juego.
- **Lógica de juego:** `src/entities/` y `src/systems/` — Movimiento, colisiones, IA, condiciones de victoria/derrota. Mantener libre de manipulaciones directas del DOM/Canvas.
- **Patrones utilizados:**
  - **State pattern:** Para gestionar estados del juego (menu, jugando, pausado, gameover).
  - **Observer pattern:** Para notificar cambios de estado a sistemas suscritos (UI, audio, partículas).
  - **Component composition:** Entidades construidas componiendo comportamientos simples (ej. `player = { position, velocity, inputHandler, renderer }`).

**Decisiones de diseño:**
- Usar `deltaTime` basado en `timestamp` del `requestAnimationFrame` para movimiento consistente en distintos dispositivos.
- Centralizar configuración de colores, tamaños, aceleraciones en `src/core/constants.js`.
- Evitar globals innecesarios; pasar dependencias por parámetros o injectarlas al iniciar.

---

## Important Constraints

**Restricciones técnicas estrictas:**

- **`requestAnimationFrame` obligatorio:** Para cualquier bucle de animación o actualización de juego. `setInterval`/`setTimeout` solo para timeout simples o UI, no para el loop principal.
- **Sin dependencias pesadas:** Solo usar Vite/ESBuild para build. Si se necesita estado complejo, considerar Zustand o Jotai (pequeñas), **nunca** lodash masivo ni jQuery.
- **Gestión de estado:** Preferir estado inmutable o actualizaciones explícitas. Evitar mutaciones accidentales de objetos de estado compartido.
- **Versiones mínimas:**
  - Node.js: `>= 18`
  - TypeScript: `>= 5.0` (si se usa TS)
  - Navegadores: Chrome/Edge últimos 2 versiones, Firefox últimos, Safari últimos (support HTML5 Canvas, Web Audio API, ES6 Modules).
- **TypeScript estricto:** `tsconfig.json` con `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`, `module: "ESNext"`, `target: "ES2022"`.
- **Modularidad:** Usar `import/export` ES6+. No combinar módulos CommonJS y ES6 en el mismo archivo sin necesidad.

---

## Setup Requirements

**Prerrequisitos de entorno:**

- **Node.js:** Versión 18 o superior (para usar las últimas features de módulos y build tools).
- **Navegadores compatibles:** Chrome, Edge, Firefox, Safari con soporte para HTML5 Canvas, WebGL (opcional), ES6 Modules, Fetch API.
- **Herramientas de desarrollo:**
  - VS Code con extensiones: `ESLint`, `Prettier`, `TypeScript`, `vscode-icons`
  - Git para control de versiones
- **Configuración inicial:** Ejecutar `npm install` tras clonado del repositorio. Esto instalará:
  - `typescript` (si se usa)
  - `vite` (servidor dev + build)
  - `eslint` + `prettier` (linter/formatter)
  - Opcional: `zod` (validación de esquemas), `zustand` (gestión de estado)

---

## Troubleshooting

**Problemas comunes y soluciones:**

| Problema | Causa probable | Solución |
|----------|----------------|----------|
| **FPS bajo / lag en canvas** | Demasiados objetos dibujados por frame, operaciones costosas en loop | Optimizar `render.js`: usar `clearRect` solo cuando cambiar, agrupar dibujos, evitar `ctx.save()`/`ctx.restore` excessivos, considerar offscreen canvas para efectos complejos |
| **Recarga en caliente no funciona** | Configuración de Vite/ESBuild, rutas incorrectas | Verificar `base` en `vite.config.js`, asegurar `src/` estructura correcta, limpiar caché del navegador (`Cmd+Shift+R` / `Ctrl+F5`) |
| **Errores de sintaxis TypeScript** | `tsconfig.json` incorrecto, uso de `any` prohibido, tipos incompatibles | Ejecutar `npm run typecheck`, corregir tipos, no evadir `strict` rules |
| **Contexto de Canvas perdido** | Navegador cambia modo (ej. multitarea, suspensión) | Escuchar `contextlost` y `contextrestore` events en el canvas, intentar re-inicializar recursos |
| **Sonidos no reproducen** | Política de autoplay del navegador, contexto de audio no resume | Llamar `audioContext.resume()` tras interacción usuario (click/touch), verificar que `play()` sea llamado por gesto de usuario |
| **Errores de "cannot find module"** | `import` paths incorrectos, configuración `baseUrl` o `paths` en `tsconfig.json` | Revisar paths en `tsconfig.json`, usar alias `@/` apuntando a `src/`, paths absolutos desde `src/` |

---

## Reglas Estrictas del Proyecto

**Normas de código inquebrantables:**

1. **Tipos estrictos (TypeScript):**
   - Todo código debe ser TypeScript con `strict: true`.
   - **Prohibido usar `any`.** Usar `unknown` si se necesita tipos dinámicos, y estrecharlos rápidamente.
   - Definir interfaces para props de componentes, estado del juego, respuestas de API.

2. **Convenciones de nombres:**
   - Archivos y carpetas: `kebab-case` o `camelCase` (consistente en todo proyecto).
   - Variables y funciones: `camelCase` en español o inglés técnico (ej. `calcularPuntuacion`, `updateGameState`, `handleKeydown`).
   - Componentes/Claases: `PascalCase`.
   - Constantes: `UPPER_SNAKE_CASE` (ej. `SCREEN_WIDTH`, `PLAYER_SPEED`).

3. **Manejo de errores:**
   - Todos los errores deben ser capturados y manejados.
   - Mensajes de error **obligatoriamente en español**.
   - Usar clases `Error` personalizadas (extender `Error`) para tipos de error distintos: `ErrorValidacion`, `ErrorProcesamiento`, `ErrorRecursos`.

4. **Comentarios y documentación:**
   - Código **autoexplicativo**. Comentarios solo donde la lógica no es obvia.
   - Documentar funciones públicas y exports con JSDoc `/** Descripción */`.
   - Evitar comentarios que solo repitan lo que el código hace.

5. **Rendimiento:**
   - Medir impacto de cambios con `performance.now()` o `console.time`.
   - No optimizar prematuramente. Si FPS < 30 en dispositivos comunes, perfilar primero.
   - Usar `requestIdleCallback` para tareas no críticas fuera del loop principal.

6. **Testing:**
   - Mínimo: pruebas unitarias para funciones puras (`validarDatosPago`, `generarIdTransaccion`, transformaciones de estado).
   - Cobertura objetivo: >80% en lógica crítica, mínimo en módulos de renderizado.

7. **Accesibilidad (opcional pero recomendado):**
   - Si el juego usa DOM/UI, asegurar contraste mínimo 4.5:1 (`color-contrast()` CSS or manual check).
   - Proporcionar alternativas de teclado para todas las acciones de mouse/touch.
   - Etiquetas semánticas HTML en componentes UI.

---

## Setup Checklist (al iniciar nuevo proyecto)

- [ ] Ejecutar `npm install`
- [ ] Verificar `npm run dev` abre navegador en `localhost:5173` (o puerto configurado)
- [ ] Confirmar `npm run lint` sin errores
- [ ] Confirmar `npm run typecheck` sin errores (si usa TS)
- [ ] Revisar `src/core/engine.js` usa `requestAnimationFrame`
- [ ] Revisar `styles/main.css` usa Custom Properties para colores/espaciados
- [ ] Configurar `vite.config.ts` con alias `@/` → `src/`
- [ ] Crear `src/main.ts/js` con initialization lógica
- [ ] Agregar `.gitignore` para `node_modules`, `dist/`, `*.temp*`

## Componente de autenticación (login)

**Archivos:** `src/components/login.js`, `src/services/auth.js`, `src/core/auth-constants.js`

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
		- Cuando el usuario solicite revisiones de seguridad, invoca automáticamente al subagente @security-auditor
		- Cuando el usuario pida cambios en la interfaz o componentes React, aplica el conocimiento de la skill     /frontend-designggg
		- Cuando se generen nuevos módulos de código, invoca al especialista en documentación para actualizar la guía
