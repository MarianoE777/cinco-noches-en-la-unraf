# AGENTS.md — Cinco noches en la UNRAF

> Instrucciones vigentes para el agente de IA en cada consulta de este proyecto.
> Stack: **Phaser 4 + Vite + JavaScript**. Plataforma objetivo: **solo PC (teclado + mouse)**.
> Idioma de respuesta: **español**.

## 1. Alcance y contexto

1. Aplicar este archivo al inicio de cada consulta y antes de modificar el proyecto.
2. Responder en español. Adaptar la profundidad del análisis a la complejidad de la solicitud: breve para consultas simples, completo (puntos 11) para cambios funcionales.
3. Rutas reales verificadas (2026-10-07):
   - Documento principal de requisitos (GDD): `docs/gdd.docx`
   - Documentación adicional: `docs/` (actualmente solo contiene el GDD)
   - Código: **no existe aún** (`package.json`, `src/`, `index.html` no encontrados)
   - Recursos gráficos: **no existe carpeta de assets**. Convención adoptada: `public/assets/` para sprites/audio y `src/` para código
   - Git: **sin repositorio inicializado** en la raíz al momento de redactar este archivo
4. Antes de afirmar rutas o estructura, verificar el estado vigente con lectura del filesystem y `git status` cuando corresponda. No depender exclusivamente de resúmenes de conversaciones anteriores.
5. Preservar el trabajo existente del usuario: no borrar, mover ni reescribir código, assets o docs fuera del alcance acordado. Si hay cambios previos sin commitear, identificar si interfieren y consultar antes de tocarlos.

## 2. Revisar la documentación y el requisito

Antes de proponer o implementar una solución:

1. Identificar el requisito solicitado y su comportamiento esperado.
2. Revisar `docs/`, en particular `docs/gdd.docx` (GDD vigente).
3. Contenido conocido del GDD (referencia rápida, no sustituye la lectura):
   - Concepto: vigilancia en oficina/cabina, cerrar puerta o ventana cuando se acerque un enemigo, con ayuda de cámaras, hasta las 6 de la mañana. Inspirado en *Five Nights at Freddy's*.
   - Premisa: guardia nocturno de la UNRAF; robots que de día fingen ser profesores y de noche atacan con exámenes.
   - Género: terror, supervivencia 2D. Un solo jugador local. Target: adolescentes y adultos.
   - Núcleo: cabina de seguridad + botón inferior para ver cámaras (10 cámaras: 2 a cada lado de la cabina, 1 camino a la cabina, 2 en aulas, 1 edificio 3, 1 profesores edificio 4, 1 salón edificio 4, 1 biblioteca, 1 puerta edificio 4).
   - 5 robots: (a) siempre va a la ventana, (b) siempre va a la puerta, (c) va a la puerta a toda velocidad al salir de su habitación, (d) solo ataca cuando se termina la batería, (e) aparece en la cabina como alucinación y desaparece al mirar cámaras.
   - Escenas: menú de inicio, dentro de la cabina, ganar, perder.
   - Victoria: fundido a negro + reloj llegando a las 6.
   - Derrota: aparición repentina del enemigo en pantalla.
4. Clasificar cada requisito como:
   - **Definido:** el GDD describe suficientemente el comportamiento.
   - **Parcialmente definido:** está contemplado, pero faltan detalles necesarios (ej. consumo de batería, duración de la noche, IA exacta por robot, controles concretos).
   - **No definido:** no aparece en la documentación revisada.
   - **En contradicción:** la solicitud difiere de una regla documentada.
   - **No aplica:** consulta técnica o documental sin regla funcional asociada.
5. Citar documento y sección. Para `gdd.docx` (Word sin numeración de páginas estable): citar por título de apartado (ej. `docs/gdd.docx > "Descripción del juego"`). Si se exporta a PDF, indicar página del archivo y, si difiere, numeración impresa.
6. Diferenciar explícitamente: **regla documentada** vs. **propuesta del agente** vs. **supuesto pendiente de confirmación**.
7. Si la documentación no existe o no puede leerse, indicarlo claramente y no afirmar que el requisito está definido o ausente.
8. Un requisito no documentado puede ser una ampliación válida: identificarlo como tal y consultar las decisiones necesarias.
9. No modificar `docs/gdd.docx` ni ningún documento de requisitos para justificar una implementación sin solicitud explícita del usuario.

## 3. Analizar conflictos e impacto

Antes de modificar una funcionalidad:

- Revisar reglas documentadas e implementación existente. Actualmente no hay implementación; cuando exista, no asumir que el código es correcto: comparar comportamiento actual vs. GDD.
- Identificar dependencias, restricciones compartidas, excepciones, prioridades entre comportamientos y posibles regresiones.
- Analizar interacciones con otras funcionalidades.
- Detectar contradicciones internas del GDD, incluidas diferencias entre texto, diagramas e imágenes.

Adaptado a este videojuego, considerar cuando corresponda:

- Estado de cabina: puerta abierta/cerrada, ventana abierta/cerrada, cámaras visibles/ocultas.
- Batería/energía: consumo por puerta, ventana, cámaras y tiempo; condición de agotamiento y robot que ataca en ese estado.
- Movimiento de los 5 robots entre las 10 cámaras y la cabina; prioridades si dos llegan a la vez.
- Ataques y derrota (jumpscare) vs. condición de victoria (reloj 6 a. m.).
- Alucinación dentro de la cabina: aparición, limpieza al abrir cámaras.
- Navegación de escenas: `Boot` / `MenuInicio` / `CabinaJuego` / `Ganar` / `Perder`.
- Controles solo PC: mouse (botones puerta/ventana/cámaras, cambio de cámara) + teclado (atajos). No diseñar ni exigir controles táctiles salvo que el usuario lo pida.

Comunicar los conflictos relevantes antes de modificar la parte afectada.

## 4. Preguntar antes de avanzar ante dudas

Cuando una duda afecte alcance, reglas, comportamiento, compatibilidad o implementación:

- Utilizar la herramienta de preguntas disponible en el entorno (por ejemplo `question`). Si no está disponible, preguntar en la conversación.
- Formular preguntas concretas, explicar qué decisión falta y por qué importa, ofrecer opciones e incluir recomendación fundamentada cuando corresponda.
- Esperar la respuesta antes de adoptar una decisión que cambie el comportamiento solicitado.
- No inventar reglas para resolver omisiones o contradicciones. Ejemplos típicos en este proyecto que requieren pregunta: duración de la noche, velocidad/agresividad por robot, consumo de batería, layout exacto de cámaras, sprites a usar.
- Continuar con tareas independientes cuyo alcance esté claro mientras se espera.

## 5. Utilizar POO y patrones de diseño

- Stack: JavaScript + Vite + Phaser 4. Modelar entidades y comportamientos del dominio con POO (clases ES).
- Encapsular estado y reglas (ej. `NightClock`, `Battery`, `Door`, `CameraSystem`, `Enemy` y subclases por robot).
- Alta cohesión, bajo acoplamiento, responsabilidades claras. Favorecer composición sobre herencia profunda.
- Separar lógica de negocio (`src/game/`, `src/enemies/`, `src/systems/`) de presentación/Phaser Scenes (`src/scenes/`) y entrada (`src/input/`).
- Estructura sugerida cuando se cree el proyecto:
  - `src/main.js` (boot Vite + Phaser.Game)
  - `src/scenes/` (MenuScene, OfficeScene, WinScene, LoseScene)
  - `src/game/` (NightManager, Battery, Doors)
  - `src/enemies/` + Factory para los 5 robots
  - `src/systems/` (CameraSystem)
- Patrones orientativos (solo si aportan valor):
  - State para fases (oficina / cámaras / victoria / derrota) y puerta/ventana.
  - Strategy para IA/efectos variables de cada robot.
  - Factory para crear los 5 robots con variantes.
  - Observer/EventEmitter de Phaser para actualizar HUD ante eventos (batería, hora, movimiento).
- Explicar brevemente patrón elegido y utilidad. Evitar abstracciones innecesarias y refactors fuera del alcance.

## 6. Reutilizar código existente

Antes de crear clases, componentes, servicios o utilidades:

1. Buscar implementaciones relacionadas (`src/**/*.js`, escenas, sistemas).
2. Revisar contratos, comportamiento y consumidores.
3. Priorizar reutilización/extensión si son compatibles.
4. No duplicar lógica de negocio (reloj nocturno, batería, cámaras, jumpscare).
5. Extraer lógica común solo ante necesidad real, preservando comportamiento de consumidores.
6. Respetar convenciones del proyecto (JS, nombres de Scenes Phaser, estilo Vite).

Estado actual: **no hay código reutilizable** (proyecto sin `src/`). Indicarlo cuando corresponda y diseñar coherente con §5. Repetir esta revisión en cada tarea; no asumir que la estructura sigue igual entre consultas.

## 7. Consultar sobre sprites y recursos gráficos

Cuando una tarea requiera sprites u otros recursos gráficos:

1. Revisar `public/assets/` (convención adoptada) y sus convenciones de uso. Actualmente la carpeta no existe: indicarlo.
2. Antes de implementar la parte visual, usar la herramienta de preguntas para confirmar si el usuario desea:
   - **Generar un mockup:** representación provisional (formas de Phaser/Graphics) para validar funcionalidad.
   - **Utilizar un recurso existente:** pedir nombre exacto y ruta.
3. Si el recurso indicado no se localiza, pedir ruta o archivo antes de avanzar con la parte que depende de él.

Además:

- No asumir qué sprite usar ni inventar nombres/rutas.
- Si es mockup, aclarar que es provisional y confirmar alcance visual mínimo.
- Si es recurso existente, comprobar disponibilidad y compatibilidad (tamaño, formato, licencia).
- Consultar spritesheet, fotogramas o animaciones cuando sean necesarios y no estén documentados.
- Continuar con la lógica independiente de gráficos mientras se resuelve la consulta.

## 8. Definir y preparar el flujo Git

Antes de implementar:

- Comprobar si hay Git (`git status`, rama actual, remotos). Estado conocido: **sin repo**. Si sigue sin repo, informar y **consultar antes de `git init` o configurar remoto**. No inicializar por cuenta propia.
- Respetar el flujo existente si ya hay repo. No asumir que `develop` existe ni imponer GitFlow completo sin acordarlo.
- Si no hay estrategia definida, consultar rama base, convención de nombres y remoto.
- Crear rama de trabajo antes de modificar código, con nombre descriptivo:
  - `feature/<descripcion>`
  - `fix/<descripcion>`
  - `docs/<descripcion>`
  - `refactor/<descripcion>`
- Si ya existe rama apropiada, verificar si corresponde continuar en ella.
- No implementar directamente sobre `main`, `master` o `develop`.
- Si hay cambios previos del usuario: preservarlos, identificar interferencias y consultar antes de cualquier operación que pueda moverlos, descartarlos o mezclarlos.

## 9. Implementar y verificar

- Definir criterios de aceptación a partir del requisito, GDD y aclaraciones del usuario.
- Cambios enfocados en el alcance acordado. Para Vite + Phaser 4, respetar `index.html`, `vite.config.js` y `src/main.js` como puntos de entrada.
- Ejecutar comprobaciones pertinentes:
  - `npm run dev` para verificación manual en PC.
  - `npm run build` para validar que el bundle Vite + Phaser compila.
  - Pruebas si existen (`npm test` / `npm run test` solo si están configuradas).
- Verificar interacciones identificadas en §3 (puerta/ventana + cámaras + batería + relojes + robots + escenas).
- Agregar pruebas solo cuando aporten valor para reglas o regresiones; evitar tests que repliquen la implementación.
- Informar qué se verificó y qué quedó pendiente. No afirmar resultados no comprobados. Si no hay proyecto Vite creado aún, indicarlo y proponer el andamiaje como primer paso.

## 10. Solicitar confirmación y realizar commit y push

Al terminar la implementación:

1. Presentar: resumen del comportamiento, archivos afectados, verificaciones y resultados, pendientes/limitaciones reales, rama utilizada.
2. Usar la herramienta de preguntas para solicitar: (a) confirmación de aceptación y (b) autorización explícita para commit y push.
3. Esperar respuesta. Si pide ajustes: realizarlos, repetir verificaciones afectadas y volver a pedir confirmación.

Tras autorización:

1. Revisar `git status`, `git diff` y `git log --oneline -10`.
2. Revisar archivos nuevos a incluir.
3. Preparar solo cambios de la tarea, sin ajenos ni secretos.
4. Commit descriptivo coherente con convenciones del repo.
5. Push de la rama al remoto acordado, configurando seguimiento si corresponde.
6. Informar rama, id/mensaje del commit y resultado del push.

Prohibido sin autorización expresa: commit, push, force push, omitir hooks, modificar config Git, fusionar ramas. Si hook/comprobación falla, resolver antes de continuar. La creación de PR y la integración requieren autorización adicional.

## 11. Comunicar el análisis y los resultados

Antes de implementar, análisis breve con los puntos pertinentes:

- **Requisito:** comportamiento solicitado.
- **Documentación:** estado y referencias (ej. `docs/gdd.docx > "Descripción del juego"`).
- **Conflictos e impacto:** funcionalidades/reglas afectadas.
- **Reutilización:** código existente aprovechable (o indicar que no hay).
- **Diseño:** enfoque POO y patrones.
- **Recursos gráficos:** confirmados en `public/assets/` o consulta pendiente (mockup vs. existente).
- **Git:** rama base y rama de trabajo (o “sin repo: pendiente autorización para init”).
- **Dudas:** decisiones que requieren respuesta.

Para consultas simples, reducir a los puntos aplicables. Al finalizar, resumir cambios, archivos, decisiones, verificaciones, pendientes reales, confirmación solicitada y —solo si se ejecutaron— resultado de commit/push. No presentar propuestas como funcionalidades implementadas.
