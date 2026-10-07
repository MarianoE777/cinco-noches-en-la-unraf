import Phaser from 'phaser';
import Door from '../game/Door.js';
import Battery from '../game/Battery.js';
import NightManager from '../game/NightManager.js';
import CameraSystem from '../systems/CameraSystem.js';

// Escena principal: cabina con puerta/ventana/cámaras/batería/reloj.
// Mockup provisional con Graphics + texto (sin assets). Solo PC: mouse + teclado.
export default class OfficeScene extends Phaser.Scene {
  constructor() {
    super('CabinaJuego');
  }

  create() {
    this.door = new Door('puerta');
    this.window = new Door('ventana');
    this.battery = new Battery();
    this.clock = new NightManager({ hourMs: 60000 });
    this.cams = new CameraSystem();

    this.add.text(480, 20, 'CABINA DE SEGURIDAD (mockup)', { fontSize: '20px', color: '#fff' }).setOrigin(0.5, 0);

    this.hud = this.add.text(16, 50, '', { fontSize: '16px', color: '#0f0' });
    this.camText = this.add.text(16, 430, '', { fontSize: '18px', color: '#0ff' });
    this.help = this.add.text(16, 520, 'P: puerta  V: ventana  C: cámaras  Q/E: cambiar cámara  K: derrota test', {
      fontSize: '14px',
      color: '#aaa'
    });

    // Botones mouse
    this.makeButton(800, 500, 'Puerta', () => this.door.toggle());
    this.makeButton(800, 540, 'Ventana', () => this.window.toggle());
    this.makeButton(650, 520, 'Cámaras', () => this.cams.toggle());

    this.input.keyboard.on('keydown-P', () => this.door.toggle());
    this.input.keyboard.on('keydown-V', () => this.window.toggle());
    this.input.keyboard.on('keydown-C', () => this.cams.toggle());
    this.input.keyboard.on('keydown-Q', () => this.cams.prev());
    this.input.keyboard.on('keydown-E', () => this.cams.next());
    this.input.keyboard.on('keydown-K', () => this.scene.start('Perder'));
  }

  makeButton(x, y, label, cb) {
    const t = this.add.text(x, y, `[ ${label} ]`, { fontSize: '16px', color: '#ff0' }).setOrigin(0.5);
    t.setInteractive({ useHandCursor: true });
    t.on('pointerdown', cb);
    return t;
  }

  update(_time, delta) {
    const dt = delta / 1000;
    this.clock.update(delta);
    this.battery.drain(dt, {
      door: this.door.isClosed(),
      window: this.window.isClosed(),
      cameras: this.cams.visible
    });

    this.hud.setText(
      `Hora: ${this.clock.getLabel()}   Batería: ${Math.ceil(this.battery.level)}%\n` +
        `Puerta: ${this.door.isClosed() ? 'CERRADA' : 'abierta'}   Ventana: ${this.window.isClosed() ? 'CERRADA' : 'abierta'}`
    );

    this.camText.setText(
      this.cams.visible ? `>> CAM ${this.cams.activeIndex + 1}/10: ${this.cams.getActive()} (mockup)` : 'Cámaras ocultas'
    );

    if (this.battery.isEmpty()) {
      this.hud.setText(this.hud.text + '\n¡SIN BATERÍA! (robot D te atacaría — pendiente GDD)');
    }

    if (this.clock.isFinished()) {
      this.scene.start('Ganar');
    }
  }
}
