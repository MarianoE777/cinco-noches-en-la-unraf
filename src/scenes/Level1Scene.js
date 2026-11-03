import OfficeScene from './OfficeScene.js';
import { LEVEL_1_MAX_ROLLS } from '../game/levels.js';

// Nivel 1: misma cabina y mismas reglas que la escena de juego, pero los números
// propios de los robots 1, 2 y 3 van de 1 a 10 y el del robot 5 de 1 a 5.
// Al completar la noche se muestra la pantalla de victoria y, al continuar,
// se pasa al Nivel 2.
// El resto (batería, reloj, cámaras, rutas y ataques) se reutiliza de OfficeScene.
export default class Level1Scene extends OfficeScene {
  constructor() {
    super('Nivel1');
  }

  getEnemyMaxRolls() {
    return LEVEL_1_MAX_ROLLS;
  }

  getLevelLabel() {
    return 'NIVEL 1';
  }

  getNextAfterVictoryScene() {
    return 'Nivel2';
  }
}
