import OfficeScene from './OfficeScene.js';
import { LEVEL_4_MAX_ROLLS } from '../game/levels.js';
import { getPhrase } from '../i18n/translations.js';

// Nivel 4: misma cabina y mismas reglas que la escena de juego, pero
// los números propios de los robots 1, 2 y 3 van de 1 a 20 y el del robot 5
// de 1 a 10. Al completar la noche se muestra la pantalla de victoria y, al
// continuar, se pasa al Nivel 5.
// El resto (batería, reloj, cámaras, rutas y ataques) se reutiliza de OfficeScene.
export default class Level4Scene extends OfficeScene {
  constructor() {
    super('Nivel4');
  }

  getEnemyMaxRolls() {
    return LEVEL_4_MAX_ROLLS;
  }

  getLevelLabel() {
    return getPhrase('Nivel 4', 'Level 4');
  }

  getNextAfterVictoryScene() {
    return 'Nivel5';
  }
}
