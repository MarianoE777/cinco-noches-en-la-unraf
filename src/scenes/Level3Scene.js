import OfficeScene from './OfficeScene.js';
import { LEVEL_3_MAX_ROLLS } from '../game/levels.js';

// Nivel 3: misma cabina y mismas reglas que la escena de juego, pero los números
// propios de los robots 1, 2 y 3 van de 1 a 17 y el del robot 5 de 1 a 8.
// Al completar la noche se muestra la pantalla de victoria y, al continuar,
// se pasa al Nivel 4.
// El resto (batería, reloj, cámaras, rutas y ataques) se reutiliza de OfficeScene.
export default class Level3Scene extends OfficeScene {
  constructor() {
    super('Nivel3');
  }

  getEnemyMaxRolls() {
    return LEVEL_3_MAX_ROLLS;
  }

  getLevelLabel() {
    return 'NIVEL 3';
  }

  getNextAfterVictoryScene() {
    return 'Nivel4';
  }
}
