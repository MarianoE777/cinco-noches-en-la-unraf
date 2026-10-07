import Phaser from 'phaser';

// Derrota según GDD: aparición repentina del enemigo (mockup provisional).
export default class LoseScene extends Phaser.Scene {
  constructor() {
    super('Perder');
  }

  create() {
    this.add.rectangle(480, 300, 960, 600, 0xaa0000);
    this.add.text(480, 280, '¡ATRAPADO!', { fontSize: '64px', color: '#fff' }).setOrigin(0.5);
    this.add.text(480, 360, 'Jumpscare mockup — aquí irá el sprite del robot', { fontSize: '16px', color: '#fff' }).setOrigin(0.5);
    this.add.text(480, 410, '[ Click o ENTER: reintentar ]', { fontSize: '16px', color: '#fff' }).setOrigin(0.5);
    this.input.once('pointerdown', () => this.scene.start('CabinaJuego'));
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('CabinaJuego'));
  }
}
