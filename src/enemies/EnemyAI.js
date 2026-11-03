// Mecánica central del GDD > "Funcionamiento de los enemigos".
// Cada 5 s se genera un número global del 1 al 20; un robot avanza solo si ese
// número es menor o igual al suyo. Lógica pura (sin Phaser).
//
// Ampliación acordada con el usuario: la primera tirada ocurre a los 20 s y
// luego una cada 5 s. El GDD no menciona esa espera inicial.
export const ROLL_SEC = 5; // una tirada global cada 5 s
export const FIRST_ROLL_SEC = 20; // espera antes de la primera tirada (ampliación)
export const MAX_ROLL = 20; // números del 1 al 20
export const ALUCINATION_ROLL = 1; // el robot 4 reacciona solo si el global es 1
export const HOUR_BONUS_STEPS = 2; // subidas a las 2 AM y 4 AM

const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

// Multiplicador de consumo de batería del robot 1 según su número propio (GDD):
// <6 no afecta, 6..10 +1%, 11..15 +1,5%, y =20 +2% más rápido.
// El GDD no cubre 16..19 (el tramo "<16" termina en 15 y el siguiente exige =20),
// así que se mantiene el 1,5% del tramo anterior.
export function batteryMultiplierFor(number) {
  if (number >= MAX_ROLL) return 1.02;
  if (number >= 11) return 1.015;
  if (number >= 6) return 1.01;
  return 1;
}

export default class EnemyAI {
  constructor({ firstRollSec = FIRST_ROLL_SEC, rollSec = ROLL_SEC } = {}) {
    this.firstRollSec = firstRollSec;
    this.rollSec = rollSec;
    this.timer = firstRollSec;
    this.global = 0; // último número global generado (0 = ningún ciclo aún)
    this.rollCount = 0;
  }

  // dt en segundos, hour: hora actual del reloj (0 = 12 AM, 2 = 2 AM, 4 = 4 AM).
  // Devuelve el número global si tocó tirada, o null si aún no.
  update(dtSeconds, hour) {
    if (hour < 0) return null; // sin tiradas antes de empezar la noche

    this.timer -= dtSeconds;
    if (this.timer > 0) return null;

    this.timer += this.rollSec;
    this.global = randInt(1, MAX_ROLL);
    this.rollCount += 1;
    return this.global;
  }

  // +1 al número propio por cada subida de hora, excepto robot 1 y robot 4 (GDD).
  hourBonus(hour, enemyId) {
    if (enemyId === 1 || enemyId === 4) return 0;
    let bonus = 0;
    for (let step = 1; step <= HOUR_BONUS_STEPS; step += 1) {
      if (hour >= step * 2) bonus += 1;
    }
    return bonus;
  }

  // Número propio efectivo (con bonus horario) de un robot, acotado a su tope.
  numberFor(enemy, hour) {
    if (enemy.rollNumber == null) return null;
    const cap = enemy.maxRoll ?? MAX_ROLL;
    return Math.min(cap, enemy.rollNumber + this.hourBonus(hour, enemy.id));
  }

  // ¿Le tocó avanzar a este robot en el ciclo vigente?
  shouldAdvance(enemy, hour) {
    const number = this.numberFor(enemy, hour);
    if (number == null) return false;
    return this.global > 0 && this.global <= number;
  }

  // Batería: multiplicador del robot 1 para el ciclo vigente.
  batteryMultiplierFor(enemy, hour) {
    const number = this.numberFor(enemy, hour);
    if (number == null) return 1;
    return batteryMultiplierFor(number);
  }
}
