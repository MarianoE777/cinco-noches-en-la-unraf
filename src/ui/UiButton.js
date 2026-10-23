// Botón de texto de la UI. Vive en coordenadas de pantalla: no participa del
// paneo de la sala, así siempre queda visible en la misma posición.
export default class UiButton {
  constructor(scene, { x, y, label, shortcut = '', onDown, depth = 20 }) {
    this.scene = scene;
    this.label = label;
    this.shortcut = shortcut;
    this.active = false;

    this.text = scene.add
      .text(x, y, '', this.styleFor(false))
      .setOrigin(0.5)
      .setDepth(depth)
      .setInteractive({ useHandCursor: true });

    this.text.on('pointerdown', onDown);
    this.refresh();
  }

  styleFor(active) {
    return {
      fontSize: '17px',
      color: active ? '#ffffff' : '#ffcf5a',
      backgroundColor: active ? '#7a1010' : '#00000066',
      padding: { x: 10, y: 6 }
    };
  }

  refresh() {
    const keys = this.shortcut ? `${this.label} (${this.shortcut})` : this.label;
    this.text.setText(`[ ${keys} ]`);
    return this;
  }

  setVisible(visible) {
    this.text.setVisible(visible);
    return this;
  }

  // Resalta el botón cuando su sistema está activo (luz prendida, puerta cerrada, etc.).
  setActive(active) {
    if (this.active === active) return this;
    this.active = active;
    this.text.setStyle(this.styleFor(active));
    return this;
  }

  destroy() {
    this.text.destroy();
  }
}
