import Phaser from 'phaser';
import { EN } from '../i18n/languages.js';
import { getLanguage, getPhrase } from '../i18n/translations.js';

// Victoria según GDD: fundido a negro + reloj llegando a las 6.
// `data.nextScene` define a dónde continuar (ej. Nivel 1 -> ... -> Nivel 5).
// Sin `nextScene` vuelve al menú.
export default class WinScene extends Phaser.Scene {
  constructor() {
    super('Ganar');
  }

  create(data = {}) {
    const nextScene = data.nextScene ?? 'MenuInicio';
    const nextLevelByScene = {
      Nivel2: 2,
      Nivel3: 3,
      Nivel4: 4,
      Nivel5: 5
    };
    const nextLevel = nextLevelByScene[nextScene];

    let nextLabel;
    if (nextLevel) {
      nextLabel =
        getLanguage() === EN
          ? `continue to Level ${nextLevel}`
          : `continuar al Nivel ${nextLevel}`;
    } else {
      nextLabel = getPhrase('volver al menú', 'return to menu');
    }

    const prompt = nextLevel
      ? getLanguage() === EN
        ? `[ Click or ENTER: ${nextLabel} ]`
        : `[ Click o ENTER: ${nextLabel} ]`
      : getPhrase('[ Click o ENTER: volver al menú ]', '[ Click or ENTER: return to menu ]');

    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.add.text(480, 250, '6 AM', { fontSize: '72px', color: '#fff' }).setOrigin(0.5);

    const detalle = data.levelLabel
      ? getPhrase(
          'NIVEL superado – sobreviviste a la noche',
          'LEVEL cleared – you survived the night'
        )
          .replace(/NIVEL|LEVEL/, data.levelLabel)
          .replace(/\s+/g, ' ')
          .trim()
      : getPhrase('Sobreviviste a la noche', 'You survived the night');

    this.add.text(480, 340, detalle, { fontSize: '20px', color: '#0f0' }).setOrigin(0.5);
    this.add.text(480, 400, prompt, { fontSize: '16px', color: '#aaa' }).setOrigin(0.5);

    const avanzar = () => this.scene.start(nextScene);
    this.input.once('pointerdown', avanzar);
    this.input.keyboard.once('keydown-ENTER', avanzar);
  }
}
