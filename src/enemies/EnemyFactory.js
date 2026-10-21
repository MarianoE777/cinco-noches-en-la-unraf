import RouteEnemy from './RouteEnemy.js';
import Edificio3Enemy from './Edificio3Enemy.js';
import HallucinationEnemy from './HallucinationEnemy.js';
import { CAMERAS } from '../systems/CameraSystem.js';

// Las 5 entidades del GDD > "Patrones de los enemigos". Los números propios
// (1..20) los asigna EnemyManager al inicio de la partida; el avance depende de
// la tirada global de EnemyAI (cada 5 s, con 20 s de espera inicial acordados).

// Robot 1: aparece en la cámara 7 y NO se mueve. Su número propio solo escala el
// consumo de batería. Al agotarse la batería salta a la sala por la puerta y
// ataca tras unos segundos (ataque imposible de bloquear).
export class BatteryEnemy extends RouteEnemy {
  constructor() {
    super({
      id: 1,
      name: 'Robot 1',
      spriteKey: 'robot1',
      route: [CAMERAS.PROFESORES_E4, 'puerta'],
      attackPolicy: 'battery',
      attackWaitSec: 5
    });
  }
}

// Robot 2: cámara 7 > Aula 1 > Salón E4 > Puerta E4 > Camino > Cabina izquierda.
// Espera 6 s y ataca; si la ventana está cerrada vuelve al Aula 1.
export class WindowRobot extends RouteEnemy {
  constructor() {
    super({
      id: 2,
      name: 'Robot 2',
      spriteKey: 'robot2',
      route: [
        CAMERAS.PROFESORES_E4,
        CAMERAS.AULA1,
        CAMERAS.SALON_E4,
        CAMERAS.PUERTA_E4,
        CAMERAS.CAMINO,
        'ventana'
      ],
      retreatTo: CAMERAS.AULA1,
      retryStep: 1,
      attackPolicy: 'attack',
      attackWaitSec: 6
    });
  }
}

// Robot 3: cámara 7 > Aula 2 > Salón E4 > Puerta E4 > Camino > Cabina derecha.
// Es el que va a la puerta; si la puerta está cerrada vuelve al Aula 2.
export class DoorRobot extends RouteEnemy {
  constructor() {
    super({
      id: 3,
      name: 'Robot 3',
      spriteKey: 'robot3',
      route: [
        CAMERAS.PROFESORES_E4,
        CAMERAS.AULA2,
        CAMERAS.SALON_E4,
        CAMERAS.PUERTA_E4,
        CAMERAS.CAMINO,
        'puerta'
      ],
      retreatTo: CAMERAS.AULA2,
      retryStep: 1,
      attackPolicy: 'attack',
      attackWaitSec: 6
    });
  }
}

// Robot 4: alucinación dentro de la cabina; desaparece al abrir las cámaras.
export class HallucinationRobot extends HallucinationEnemy {
  constructor() {
    super({
      id: 4,
      name: 'Robot 4',
      spriteKey: 'robot4',
      appearDelaySec: 5
    });
  }
}

// Robot 5: vive en el Edificio 3 (cámara 6) y cambia de fase con las tiradas.
export class Edificio3Robot extends Edificio3Enemy {
  constructor() {
    super({
      id: 5,
      name: 'Robot 5',
      spriteKey: 'robot5',
      cameraIndex: CAMERAS.EDIFICIO3,
      finalCountdownSec: 10
    });
  }
}

export default class EnemyFactory {
  static createAll() {
    return [
      new BatteryEnemy(),
      new WindowRobot(),
      new DoorRobot(),
      new HallucinationRobot(),
      new Edificio3Robot()
    ];
  }
}
