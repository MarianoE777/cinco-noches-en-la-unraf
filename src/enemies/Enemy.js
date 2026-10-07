// Base de enemigos. La IA final está pendiente (GDD solo define destinos).
// Strategy previsto: cada subclase define su comportamiento de movimiento/ataque.
export default class Enemy {
  constructor(name, target) {
    this.name = name;
    this.target = target; // 'puerta' | 'ventana' | 'cabina' | 'bateria'
  }

  // Stub: las subclases implementan update real.
  update() {}
}
