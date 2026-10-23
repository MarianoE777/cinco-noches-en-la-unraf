import OfficeScene from './OfficeScene.js';
import { LEVEL_2_MAX_ROLLS } from '../game/levels.js';

// Nivel 2: misma cabina y mismas reglas que la escena de juego, pero los números
// propios de los robots 1, 2 y 3 van de 1 a 14 y el del robot 5 de 1 a 6.
// Al completar la noche se muestra la pantalla de victoria y, al continuar,
// se vuelve al menú (no hay Nivel 3).
// El resto (batería, reloj, cámaras, rutas y ataques) se reutiliza de OfficeScene.
export default class Level2Scene extends OfficeScene {
  constructor() {
    super('Nivel2');
  }

  getEnemyMaxRolls() {
    return LEVEL_2_MAX_ROLLS;
  }

  getLevelLabel() {
    return 'NIVEL 2';
  }
}
