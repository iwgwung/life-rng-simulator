# Skill: GameJuice Architect

**Objetivo:** Elevar juegos web de "funcionales" a "experiencias táctiles" mediante feedback sensorial exagerado pero elegante.

## 1. Principio de "Juice" (Interacción Física)
- **Juice ≠ Gameplay:** El feedback sensorial (partículas, shake, flash) NUNCA cambia las reglas; solo cambia cómo se siente la acción.
- **Regla de Oro:** Si una interacción es importante, *debe* tener un "peso". 
    - *Screen shake* al ganar/perder.
    - *Hit-stop* (pausa de 50-100ms) en eventos críticos para enfatizar el impacto.
    - Números que se desplazan y desvanecen con easing de salida.

## 2. Diseño de Audio Sintético (Web Audio API)
- **Zero-Weight Audio:** Usar osciladores para evitar descargas innecesarias.
- **Armonía Coherente:** Todo el juego debe estar en una escala definida (ej: Do Mayor Pentatónica).
- **Ducking:** La música de fondo debe bajar automáticamente su volumen (ducking) cuando se dispara un efecto de sonido importante.
- **Readable Audio:** El audio debe ser "leíble". Un jugador debe saber qué ocurrió sin mirar la pantalla.

## 3. Movimiento Natural y Fluido
- **Easing Físico:** Prohibido usar `linear` o `ease` estándar. Todo debe usar curvas de *spring* (resorte) o *linear-easing* que simulen masa y fricción.
- **Staggering:** Las entradas de UI deben ser escalonadas (*staggered delay*) para guiar la atención del usuario.
- **View Transitions:** Implementar transiciones de elementos aislados para no perder contexto durante los cambios de estado.

## 4. Accesibilidad y Rendimiento
- **Respeto al sistema:** Honrar las preferencias de reducción de movimiento y temas (light/dark) del SO.
- **Audible Readability:** Diseñar interfaces que se entiendan perfectamente incluso si el jugador tiene el audio en mute (redundancia visual).
