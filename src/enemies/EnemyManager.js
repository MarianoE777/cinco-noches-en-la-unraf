import Phaser from 'phaser';
import EnemyAI, { MAX_ROLL } from './EnemyAI.js';

const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

// Orquesta la IA de los 5 enemigos y notifica la derrota por evento (Observer).
// Asigna los números propios (1..20) al inicio de la partida y reparte a cada
// robot la tirada global que genera EnemyAI cada 5 s.
export default class EnemyManager {
  constructor(enemies) {
    this.enemies = enemies;
    this.ai = new EnemyAI();
    this.events = new Phaser.Events.EventEmitter();
    this.reset();
  }

  // Reinicia números propios y temporizador de tiradas (nueva partida).
  // El robot 4 no tiene número propio (su disparador es la tirada global = 1).
  reset() {
    this.enemies.forEach((enemy) => {
      const participates = enemy.enabled && enemy.usesRollNumber;
      const cap = enemy.maxRoll ?? MAX_ROLL;
      enemy.rollNumber = participates ? randInt(1, cap) : null;
    });
    this.ai = new EnemyAI();
  }

  // dt en segundos, ctx: { hour, doorClosed, windowClosed, batteryEmpty, camsVisible }.
  update(dtSeconds, ctx) {
    const rolled = this.ai.update(dtSeconds, ctx.hour);
    const rollHappened = rolled !== null;

    this.enemies.forEach((enemy) => {
      if (!enemy.enabled) return;
      // Cada robot recibe su propio veredicto: solo avanza si la tirada global
      // es menor o igual a su número propio (EnemyAI.shouldAdvance).
      // `rolled` avisa que hubo tirada, sin importar el número (lo usa el robot 4).
      enemy.update(dtSeconds, {
        ...ctx,
        rolled: rollHappened,
        advance: rollHappened && this.ai.shouldAdvance(enemy, ctx.hour),
        globalRoll: this.ai.global,
        onDefeat: (defeated) => this.events.emit('defeat', { enemy: defeated })
      });
    });
  }

  // ¿Le tocó avanzar a este robot? (consulta del HUD o de la vista).
  shouldAdvance(enemy, hour) {
    return this.ai.shouldAdvance(enemy, hour);
  }

  // Multiplicador de consumo de batería del robot 1 para el ciclo vigente.
  batteryMultiplier(hour) {
    const robot1 = this.getById(1);
    return this.ai.batteryMultiplierFor(robot1, hour);
  }

  getGlobalRoll() {
    return this.ai.global;
  }

  getAll() {
    return this.enemies;
  }

  getById(id) {
    return this.enemies.find((enemy) => enemy.id === id);
  }
}
