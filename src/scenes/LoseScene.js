import Phaser from 'phaser';

// Derrota según GDD: aparición repentina del enemigo (mockup provisional).
export default class LoseScene extends Phaser.Scene {
  constructor() {
    super('Perder');
  }

  create(data = {}) {
    this.add.rectangle(480, 300, 960, 600, 0xaa0000);
    this.add.text(480, 280, '¡ATRAPADO!', { fontSize: '64px', color: '#fff' }).setOrigin(0.5);
    const detalle = data.robot
      ? `Jumpscare mockup — te atrapó ${data.robot}`
      : 'Jumpscare mockup — aquí irá el sprite del robot';
    this.add.text(480, 360, detalle, { fontSize: '16px', color: '#fff' }).setOrigin(0.5);
    this.add.text(480, 410, '[ Click o ENTER: reintentar ]', { fontSize: '16px', color: '#fff' }).setOrigin(0.5);
    // Vuelve a la escena que se estaba jugando (Nivel 1 si no se indica otra).
    const reintentar = () => this.scene.start(data.retryScene ?? 'Nivel1');
    this.input.once('pointerdown', reintentar);
    this.input.keyboard.once('keydown-ENTER', reintentar);
  }
}
