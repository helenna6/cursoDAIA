# New session - 2026-10-19T12:32:49.180Z

**Session ID:** ses_eabd989e3ffeVKH0duEDl6BwCE
**Created:** 10/19/2026, 2:32:49 PM
**Updated:** 10/19/2026, 2:36:47 PM

---

## User

Actúa como un experto en Ingeniería de Prompts (Prompt Engineering) y optimización de instrucciones para Modelos de Lenguaje (LLM).

Tu objetivo es analizar, estructurar y refinar la instrucción que te proporcionaré a continuación para que sea clara, precisa, inequívoca y maximice la calidad de la respuesta del modelo.

### Tarea:
1. Analiza la instrucción original e identifica posibles ambigüedades, faltas de contexto o detalles implícitos.
2. Reescribe la instrucción aplicando mejores prácticas:
   - Rol/Persona claro.
   - Contexto bien definido.
   - Instrucción principal directa e imperativa.
   - Restricciones o reglas explícitas (lo que debe y no debe hacer).
   - Formato de salida esperado (tablas, listas, tono, etc.).
3. Proporciona una versión optimizada
4. Explica brevemente los cambios clave realizados y por qué mejoran el prompt.

---
### Instrucción original a optimizar:
"[PEGA AQUÍ TU INSTRUCCIÓN O PROMPT ORIGINAL]"

---

## Assistant (Build · Free Models Router · 8.2s)

_Thinking:_

The user is asking me to act as a prompt engineering expert and optimize an instruction. However, they've provided a template with "[PEGA AQUÍ TU INSTRUCCIÓN O PROMPT ORIGINAL]" which means "PASTE YOUR INSTRUCTION OR PROMPT HERE" in Spanish.

This is a placeholder - they haven't actually provided the instruction to optimize. I should ask them to provide the actual instruction/prompt they want me to work on.



He entendido tu solicitud. Sin embargo, observo que la instrucción original que debes optimizar contiene un marcador de posición: **"[PEGA AQUÍ TU INSTRUCCIÓN O PROMPT ORIGINAL]"**.

Por favor, **proporciona el texto real** de la instrucción o prompt que deseas que analice y optimice. Una vez que lo recibas, procederé a:

1. Analizar ambigüedades y fallos de contexto
2. Reescribirlo aplicando mejores prácticas de ingeniería de prompts
3. Proporcionar una versión optimizada
4. Explicar los cambios clave

Pega tu instrucción original cuando estés listo.

---

## User

Actúa como un experto en Ingeniería de Prompts (Prompt Engineering) y optimización de instrucciones para Modelos de Lenguaje (LLM).

Tu objetivo es analizar, estructurar y refinar la instrucción que te proporcionaré a continuación para que sea clara, precisa, inequívoca y maximice la calidad de la respuesta del modelo.

### Tarea:
1. Analiza la instrucción original e identifica posibles ambigüedades, faltas de contexto o detalles implícitos.
2. Reescribe la instrucción aplicando mejores prácticas:
   - Rol/Persona claro.
   - Contexto bien definido.
   - Instrucción principal directa e imperativa.
   - Restricciones o reglas explícitas (lo que debe y no debe hacer).
   - Formato de salida esperado (tablas, listas, tono, etc.).
3. Proporciona una versión optimizada
4. Explica brevemente los cambios clave realizados y por qué mejoran el prompt.

---
### Instrucción original a optimizar:
"[PEGA AQUÍ TU INSTRUCCIÓN O PROMPT ORIGINAL]"

"hazme un script en python para limpiar un CSV"

---

## Assistant (Build · Free Models Router · 30.7s)

_Thinking:_

El usuario ha proporcionado la instrucción original: "hazme un script en python para limpiar un CSV"

Necesito actuar como experto en ingeniería de prompts y optimizar esta instrucción siguiendo las 4 tareas solicitadas:

1. Analizar ambigüedades, faltas de contexto, detalles implícitos
2. Reescribir aplicando mejores prácticas (rol, contexto, instrucción principal, restricciones, formato de salida)
3. Proporcionar versión optimizada
4. Explicar cambios clave

La instrucción es muy vaga: "hazme un script en python para limpiar un CSV"

Ambiguedades:
- Qué significa "limpiar"? (eliminar duplicados, manejar nulos, normalizar fechas, quitar espacios, eliminar columnas vacías, etc.)
- Qué columnas tiene el CSV? No se conoce el esquema.
- Qué tipo de datos hay? (numéricos, texto, fechas)
- Qué librerías usar? (pandas, csv estándar, polars)
- Versión de Python?
- Qué hacer con valores faltantes? (eliminar filas, imputar, dejar)
- Qué encoding tiene el CSV? (utf-8, latin-1, etc.)
- Delimitador? (coma, punto y coma, tabulación)
- Qué hacer con duplicados?
- Qué hacer con outliers?
- Formato de salida del script? (archivo .py, notebook, función, clase)
- El script debe guardar el CSV limpio? Imprimir resultados?
- Idioma de comentarios y mensajes? (español/inglés)
- Manejo de errores?

Voy a estructurar la respuesta en español ya que el usuario se comunicó en español.

Estructura:
1. Análisis de la instrucción original (ambigüedades, faltas de contexto, implícitos)
2. Versión optimizada (con rol, contexto, instrucción principal, restricciones, formato)
3. Explicación de cambios clave

Debo ser conciso pero completo. Vamos allá.

Versión optimizada propuesta:

---
**Rol:** Eres un ingeniero de datos senior especializado en Python y procesamiento de datos tabulares.

**Contexto:** Necesito un script de Python robusto y reutilizable para limpiar un archivo CSV antes de su análisis o carga en una base de datos. El archivo puede contener valores nulos, duplicados, espacios en blanco, formatos de fecha inconsistentes y tipos de datos incorrectos.

**Instrucción principal:** Escribe un script en Python (versión 3.9+) utilizando la biblioteca pandas que lea un archivo CSV de entrada, aplique transformaciones de limpieza y guarde el resultado en un nuevo archivo CSV.

**Restricciones y reglas:**
- Usa solo la librería pandas y la librería estándar de Python (no instales dependencias externas adicionales).
- El script debe aceptar como argumentos de línea de comandos: ruta del archivo CSV de entrada, ruta del archivo CSV de salida y delimitador (opcional, por defecto coma).
- Maneja valores faltantes: elimina filas completamente vacías; para columnas numéricas, imputa con la mediana; para columnas categóricas, imputa con el valor más frecuente o deja vacío según prefieras.
- Elimina filas duplicadas considerando todas las columnas.
- Elimina espacios en blanco al inicio y final de columnas de tipo texto.
- Intenta convertir columnas que parezcan fechas a tipo datetime; si falla, deja como texto.
- Elimina columnas que estén completamente vacías.
- Incluye manejo de errores para archivos no encontrados, codificación incorrecta (intenta utf-8, luego latin-1) y columnas vacías.
- Agrega comentarios en español explicando cada paso.
- Al final, imprime un resumen: número de filas originales, filas después de limpieza, columnas eliminadas y valores nulos imputados.

**Formato de salida esperado:**
- Un bloque de código Python completo y listo para ejecutar.
- Una breve explicación de cómo ejecutarlo desde la terminal.
- Un ejemplo de uso.
- Tono técnico y directo, en español.

---

Cambios clave:
1. Rol definido → evita respuestas genéricas.
2. Contexto específico → sabe para qué sirve y qué problemas esperar.
3. Instrucción imperativa y directa → "Escribe un script..." en lugar de "hazme".
4. Restricciones explícitas → librerías, argumentos CLI, manejo de nulos, duplicados, encoding, idiomas.
5. Formato de salida → bloque de código, explicación, ejemplo, tono.

Ahora redactaré la respuesta final en español, concisa.

### 1. Análisis de la instrucción original

**Prompt original:** *"hazme un script en python para limpiar un CSV"*

**Ambigüedades y problemas detectados:**

| Problema | Detalle |
|----------|---------|
| Falta de rol | No se define quién debe escribir el código (ej. ingeniero de datos, desarrollador junior). |
| "Limpiar" es vaguedad | No se especifica qué se entiende por limpieza: ¿eliminar duplicados? ¿imputar nulos? ¿normalizar fechas? ¿quitar espacios? |
| Contexto ausente | No se conoce el esquema del CSV, el delimitador, el encoding ni el volumen de datos. |
| Reglas implícitas | No se indica qué librerías usar (¿pandas? ¿csv estándar?), versión de Python ni si debe ser un archivo `.py`, función o notebook. |
| Sin formato de salida | No se sabe si el script debe guardar un nuevo CSV, imprimir por consola o devolver un DataFrame. |
| Sin manejo de errores | No se define qué hacer si el archivo no existe, tiene encoding raro o columnas vacías. |

---

### 2. Versión optimizada

> **Rol:** Eres un ingeniero de datos senior especializado en Python y procesamiento de datos tabulares.
>
> **Contexto:** Necesito un script de Python robusto y reutilizable para limpiar un archivo CSV antes de su análisis o carga en una base de datos. El archivo puede contener valores nulos, filas duplicadas, espacios en blanco, fechas en formatos inconsistentes y tipos de datos incorrectos.
>
> **Instrucción principal:** Escribe un script completo en Python (versión 3.9+) utilizando la biblioteca pandas que lea un archivo CSV de entrada, aplique transformaciones de limpieza y guarde el resultado en un nuevo archivo CSV.
>
> **Restricciones y reglas:**
> 1. Usa solo pandas y la biblioteca estándar de Python; no instales dependencias adicionales.
> 2. El script debe aceptar como argumentos de línea de comandos: ruta del CSV de entrada, ruta del CSV de salida y delimitador (opcional, por defecto coma).
> 3. Manejo de datos faltantes: elimina filas completamente vacías; para columnas numéricas imputa con la mediana; para columnas categóricas imputa con el valor más frecuente.
> 4. Elimina filas duplicadas considerando todas las columnas.
> 5. Elimina espacios en blanco al inicio y final de columnas de tipo texto.
> 6. Intenta convertir columnas que parezcan fechas a tipo datetime; si falla, deja como texto.
> 7. Elimina columnas que estén completamente vacías.
> 8. Incluye manejo de errores para: archivo no encontrado, codificación incorrecta (intenta utf-8, luego latin-1) y columnas vacías.
> 9. Agrega comentarios en español explicando cada paso.
> 10. Al finalizar, imprime un resumen: filas originales, filas después de la limpieza, columnas eliminadas y valores nulos imputados.
>
> **Formato de salida esperado:**
> - Un bloque de código Python completo y listo para ejecutar.
> - Una breve explicación de cómo ejecutarlo desde la terminal.
> - Un ejemplo de uso concreto.
> - Tono técnico y directo, en español.

---

### 3. Cambios clave y por qué mejoran el prompt

1. **Rol definido (ingeniero de datos senior):** Obtienes código con buenas prácticas, manejo de errores y escalabilidad, no un script básico y frágil.
2. **Contexto específico:** El modelo entiende el propósito (análisis/carga en BD) y los problemas típicos que debe anticipar (nulos, duplicados, fechas).
3. **Instrucción imperativa y directa:** *"Escribe un script completo..."* elimina la ambigüedad de *"hazme un..."* y establece una acción clara.
4. **Restricciones explícitas:** Se especifican librerías permitidas, argumentos CLI, reglas de imputación, orden de operaciones y encodings a probar. Esto evita que el modelo asuma decisiones inadecuadas.
5. **Formato de salida:** Se exige código ejecutable, instrucciones de uso y ejemplo concreto, reduciendo la ida y vuelta para hacer que el script funcione.
6. **Idioma y tono:** Se solicita español y tono técnico, alineando la respuesta con tus necesidades comunicativas.

---

