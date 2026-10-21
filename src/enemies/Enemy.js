// Base de enemigos. La lógica es pura (sin Phaser): la escena consulta el estado
// de cada robot y un EnemyView se encarga de dibujarlo.
// Strategy: cada subclase define su IA en update().
//
// Mecánica de números (GDD > "Funcionamiento de los enemigos"): al inicio de la
// partida cada robot recibe un número 1..20 en `rollNumber`. Un EnemyAI genera el
// número global y avisa a cada robot cuándo le toca avanzar.
export default class Enemy {
  constructor({ id, name, spriteKey, location = 'oculto', cameraIndex = null, rollNumber = null }) {
    this.id = id;
    this.name = name;
    this.spriteKey = spriteKey;
    // 'camara' | 'puerta' | 'ventana' | 'oficina' | 'oculto'
    this.location = location;
    // Índice 0-based de CameraSystem cuando location === 'camara'.
    this.cameraIndex = cameraIndex;
    // Número propio 1..20 asignado al inicio de la partida (null = no participa).
    this.rollNumber = rollNumber;
    this.enabled = true;
  }

  // dt en segundos, ctx: {
  //   hour, doorClosed, windowClosed, batteryEmpty, camsVisible,
  //   advance (bool: le tocó la tirada global), onDefeat
  // }.
  update(_dt, _ctx) {}

  emitDefeat(ctx) {
    if (typeof ctx.onDefeat === 'function') {
      ctx.onDefeat(this);
    }
  }

  isInCamera(index) {
    return this.location === 'camara' && this.cameraIndex === index;
  }
}
