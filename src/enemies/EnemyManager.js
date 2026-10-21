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
  reset() {
    this.enemies.forEach((enemy) => {
      enemy.rollNumber = enemy.enabled ? randInt(1, MAX_ROLL) : null;
    });
    this.ai = new EnemyAI();
  }

  // dt en segundos, ctx: { hour, doorClosed, windowClosed, batteryEmpty, camsVisible }.
  update(dtSeconds, ctx) {
    const rolled = this.ai.update(dtSeconds, ctx.hour);
    const context = {
      ...ctx,
      advance: rolled !== null,
      globalRoll: this.ai.global,
      onDefeat: (enemy) => this.events.emit('defeat', { enemy })
    };
    this.enemies.forEach((enemy) => {
      if (enemy.enabled) enemy.update(dtSeconds, context);
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
