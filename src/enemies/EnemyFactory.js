import Enemy from './Enemy.js';

// 5 robots según docs/gdd.docx > "Descripción del juego".
// Nombres provisorios; IA y velocidades pendientes de confirmación.
export class WindowRobot extends Enemy {
  constructor() {
    super('Robot Ventana', 'ventana');
  }
}

export class DoorRobot extends Enemy {
  constructor() {
    super('Robot Puerta', 'puerta');
  }
}

export class FastDoorRobot extends Enemy {
  constructor() {
    super('Robot Puerta Rápido', 'puerta');
  }
}

export class BatteryRobot extends Enemy {
  constructor() {
    super('Robot Batería', 'bateria');
  }
}

export class HallucinationRobot extends Enemy {
  constructor() {
    super('Alucinación', 'cabina');
  }
}

export default class EnemyFactory {
  static createAll() {
    return [
      new WindowRobot(),
      new DoorRobot(),
      new FastDoorRobot(),
      new BatteryRobot(),
      new HallucinationRobot()
    ];
  }
}
