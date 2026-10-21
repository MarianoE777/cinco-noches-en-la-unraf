// Paneo horizontal de la sala: si el mouse entra en las zonas de los bordes de la
// pantalla, la vista se desplaza hacia ese lado (acelerando cuanto más adentro del
// borde está el puntero) hasta llegar a los límites de la imagen.
// Clase independiente de Phaser para poder probarla aisladamente.
export default class ScreenPanner {
  // speed: px de mundo por segundo al entrar a fondo en la zona de borde
  // zoneRatio: fracción del ancho de pantalla que activa el paneo (0.12 = 12%)
  constructor({ speed = 520, zoneRatio = 0.12 } = {}) {
    this.speed = speed;
    this.zoneRatio = zoneRatio;
  }

  // Devuelve el nuevo desplazamiento (en px de pantalla) ya acotado a [0, maxPan].
  update({ pointerX, viewWidth, dt, current, maxPan }) {
    if (maxPan <= 0) return 0;

    const zone = viewWidth * this.zoneRatio;
    let dir = 0;

    if (pointerX > viewWidth - zone) {
      // Borde derecho: 0 al entrar en la zona, 1 en el extremo.
      dir = Math.min(1, (pointerX - (viewWidth - zone)) / zone);
    } else if (pointerX < zone) {
      // Borde izquierdo.
      dir = -Math.min(1, (zone - pointerX) / zone);
    }

    const next = current + dir * this.speed * dt;
    if (next < 0) return 0;
    if (next > maxPan) return maxPan;
    return next;
  }
}
