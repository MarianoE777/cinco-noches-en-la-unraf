// Configuración de niveles (ampliación fuera del GDD: el documento no define niveles).
// Cada entrada limita el número propio (1..N) de los robots indicados; los robots
// que no aparecen conservan el tope general (20).
export const LEVEL_1_MAX_ROLLS = Object.freeze({
  1: 10,
  2: 10,
  3: 10,
  5: 5
});

// Nivel 2: robots 1, 2 y 3 -> 1..14 · robot 5 -> 1..6.
export const LEVEL_2_MAX_ROLLS = Object.freeze({
  1: 14,
  2: 14,
  3: 14,
  5: 6
});

export const LEVELS = Object.freeze({
  Nivel1: Object.freeze({
    name: 'Nivel 1',
    maxRolls: LEVEL_1_MAX_ROLLS
  }),
  Nivel2: Object.freeze({
    name: 'Nivel 2',
    maxRolls: LEVEL_2_MAX_ROLLS
  })
});
