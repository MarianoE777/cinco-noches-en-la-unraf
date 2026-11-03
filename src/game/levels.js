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

// Nivel 3: robots 1, 2 y 3 -> 1..17 · robot 5 -> 1..8.
export const LEVEL_3_MAX_ROLLS = Object.freeze({
  1: 17,
  2: 17,
  3: 17,
  5: 8
});

// Nivel 4: robots 1, 2 y 3 -> 1..20 · robot 5 -> 1..10.
export const LEVEL_4_MAX_ROLLS = Object.freeze({
  1: 20,
  2: 20,
  3: 20,
  5: 10
});

// Nivel 5 (último): los números propios no se sortean; son fijos.
// Robots 1, 2 y 3 -> siempre 20 · robot 5 -> siempre 10.
export const LEVEL_5_FIXED_ROLLS = Object.freeze({
  1: 20,
  2: 20,
  3: 20,
  5: 10
});

export const LEVELS = Object.freeze({
  Nivel1: Object.freeze({
    name: 'Nivel 1',
    maxRolls: LEVEL_1_MAX_ROLLS
  }),
  Nivel2: Object.freeze({
    name: 'Nivel 2',
    maxRolls: LEVEL_2_MAX_ROLLS
  }),
  Nivel3: Object.freeze({
    name: 'Nivel 3',
    maxRolls: LEVEL_3_MAX_ROLLS
  }),
  Nivel4: Object.freeze({
    name: 'Nivel 4',
    maxRolls: LEVEL_4_MAX_ROLLS
  }),
  Nivel5: Object.freeze({
    name: 'Nivel 5',
    maxRolls: LEVEL_5_FIXED_ROLLS,
    fixedRolls: LEVEL_5_FIXED_ROLLS
  })
});
