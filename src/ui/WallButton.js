import Phaser from 'phaser';

// Botón dibujado sobre la pared de la sala. Se define en coordenadas de la sala
// (mismo espacio que las imágenes de puerta/ventana, es decir, de la imagen de
// fondo de 1536x688) y se reposiciona cada frame según el paneo actual, de modo
// que queda "pegado" a la pared y a su imagen asociada.
// No lleva etiqueta de texto: solo el área de clic resaltada sobre la pared.
export default class WallButton {
  constructor(scene, { x, y, width, height, onDown, depth = 20 }) {
    this.roomX = x;
    this.roomY = y;
    this.width = width;
    this.height = height;
    this.active = false;

    this.rect = scene.add
      .rectangle(x, y, width, height, 0x000000, 0.45)
      .setOrigin(0)
      .setDepth(depth)
      .setStrokeStyle(2, 0xffcf5a);

    // Área de clic exactamente igual al rectángulo indicado por el usuario.
    this.rect.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, width, height),
      Phaser.Geom.Rectangle.Contains
    );
    this.rect.on('pointerdown', onDown);
  }

  // Reubica el botón en coordenadas de pantalla según el paneo y la escala de la sala.
  update(pan, roomScale) {
    const sx = this.roomX * roomScale - pan;
    const sy = this.roomY * roomScale;

    this.rect.setPosition(sx, sy).setScale(roomScale);
    return this;
  }

  setVisible(visible) {
    this.rect.setVisible(visible);
    return this;
  }

  // Resalta el botón cuando su sistema está activo (barrera cerrada, luz prendida, etc.).
  setActive(active) {
    if (this.active === active) return this;
    this.active = active;
    this.rect.setFillStyle(active ? 0x7a1010 : 0x000000, active ? 0.85 : 0.45);
    this.rect.setStrokeStyle(2, active ? 0xffffff : 0xffcf5a);
    return this;
  }
}
