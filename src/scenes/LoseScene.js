import Phaser from 'phaser';
import { EN } from '../i18n/languages.js';
import { getLanguage, getPhrase } from '../i18n/translations.js';

// Derrota según GDD: aparición repentina del enemigo.
// Fondo: susto a pantalla completa + grito reproducido una sola vez por derrota.
export default class LoseScene extends Phaser.Scene {
  constructor() {
    super('Perder');
  }

  preload() {
    this.load.image('sustoAsustador', 'assets/susto_asustador.png');
    this.load.audio('grito', 'vfx/grito.mp3');
  }

  create(data = {}) {
    // Imagen de fondo cubriendo el lienzo 960x600 sin deformar (recorta el sobrante).
    const fondo = this.add.image(480, 300, 'sustoAsustador');
    const escala = Math.max(960 / fondo.width, 600 / fondo.height);
    fondo.setScale(escala);

    // Un solo disparo por derrota.
    this.sound.play('grito');

    this.add
      .text(480, 280, getPhrase('¡PERDISTE!', 'YOU LOST!'), {
        fontSize: '64px',
        color: '#fff'
      })
      .setOrigin(0.5);

    const detalle = data.robot
      ? getPhrase(`Te mató ${data.robot}`, `You were killed by ${data.robot}`)
      : getPhrase('Te mataron', 'They killed you');

    this.add.text(480, 360, detalle, { fontSize: '16px', color: '#fff' }).setOrigin(0.5);
    this.add
      .text(480, 410, getPhrase('[ Click o ENTER: reintentar ]', '[ Click or ENTER: retry ]'), {
        fontSize: '16px',
        color: '#fff'
      })
      .setOrigin(0.5);
    // Vuelve a la escena que se estaba jugando (Nivel 1 si no se indica otra).
    const reintentar = () => this.scene.start(data.retryScene ?? 'Nivel1');
    this.input.once('pointerdown', reintentar);
    this.input.keyboard.once('keydown-ENTER', reintentar);
  }
}
