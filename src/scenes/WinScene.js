import Phaser from 'phaser';

// Victoria según GDD: fundido a negro + reloj llegando a las 6.
export default class WinScene extends Phaser.Scene {
  constructor() {
    super('Ganar');
  }

  create() {
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.add.text(480, 250, '6 AM', { fontSize: '72px', color: '#fff' }).setOrigin(0.5);
    this.add.text(480, 340, 'Sobreviviste a la noche', { fontSize: '20px', color: '#0f0' }).setOrigin(0.5);
    this.add.text(480, 400, '[ Click o ENTER: volver al menú ]', { fontSize: '16px', color: '#aaa' }).setOrigin(0.5);
    this.input.once('pointerdown', () => this.scene.start('MenuInicio'));
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('MenuInicio'));
  }
}
