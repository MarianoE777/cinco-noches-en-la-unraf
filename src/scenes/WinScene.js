import Phaser from 'phaser';

// Victoria según GDD: fundido a negro + reloj llegando a las 6.
// `data.nextScene` define a dónde continuar (ej. Nivel 1 -> Nivel 2).
// Sin `nextScene` vuelve al menú.
export default class WinScene extends Phaser.Scene {
  constructor() {
    super('Ganar');
  }

  create(data = {}) {
    const nextScene = data.nextScene ?? 'MenuInicio';
    const nextLabel = nextScene === 'Nivel2' ? 'continuar al Nivel 2' : 'volver al menú';

    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.add.text(480, 250, '6 AM', { fontSize: '72px', color: '#fff' }).setOrigin(0.5);
    const detalle = data.levelLabel
      ? `${data.levelLabel} superado — sobreviviste a la noche`
      : 'Sobreviviste a la noche';
    this.add.text(480, 340, detalle, { fontSize: '20px', color: '#0f0' }).setOrigin(0.5);
    this.add.text(480, 400, `[ Click o ENTER: ${nextLabel} ]`, { fontSize: '16px', color: '#aaa' }).setOrigin(0.5);

    const avanzar = () => this.scene.start(nextScene);
    this.input.once('pointerdown', avanzar);
    this.input.keyboard.once('keydown-ENTER', avanzar);
  }
}
