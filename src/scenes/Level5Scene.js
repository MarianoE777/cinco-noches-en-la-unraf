import OfficeScene from './OfficeScene.js';
import { LEVEL_5_FIXED_ROLLS } from '../game/levels.js';
import { getPhrase } from '../i18n/translations.js';

// Nivel 5 (último): misma cabina y mismas reglas que la escena de juego, pero
// los números propios de los robots 1, 2 y 3 son siempre 20 y el del robot 5
// siempre 10 (no se sortean). Al completar la noche se muestra la pantalla de
// victoria y, al continuar, se vuelve al menú.
// El resto (batería, reloj, cámaras, rutas y ataques) se reutiliza de OfficeScene.
export default class Level5Scene extends OfficeScene {
  constructor() {
    super('Nivel5');
  }

  getEnemyMaxRolls() {
    return LEVEL_5_FIXED_ROLLS;
  }

  getEnemyFixedRolls() {
    return LEVEL_5_FIXED_ROLLS;
  }

  getLevelLabel() {
    return getPhrase('Nivel 5', 'Level 5');
  }
}
