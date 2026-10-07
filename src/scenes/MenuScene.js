import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuInicio');
  }

  create() {
    this.add.text(480, 180, 'CINCO NOCHES EN LA UNRAF', { fontSize: '36px', color: '#fff' }).setOrigin(0.5);
    this.add.text(480, 260, 'Guardia nocturno — sobrevive hasta las 6 AM', { fontSize: '18px', color: '#aaa' }).setOrigin(0.5);
    this.add.text(480, 340, '[ Click o ENTER para entrar a la cabina ]', { fontSize: '20px', color: '#ff0' }).setOrigin(0.5);

    this.input.once('pointerdown', () => this.scene.start('CabinaJuego'));
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('CabinaJuego'));
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('CabinaJuego'));
  }
}
