import Enemy from './Enemy.js';

// Robot que avanza cámara por cámara hasta la cabina.
//
// route: lista de pasos; números = índice de cámara (0-based) y el último puede
//        ser 'puerta' o 'ventana' (pasos que no son cámaras: quedan frente a la
//        barrera de la oficina). Los pasos de cámara solo avanzan cuando el
//        EnemyAI avisa que la tirada global le tocó (ctx.advance).
// attackPolicy:
//   'attack' -> al llegar a la barrera espera attackWaitSec y ataca. Si la
//               barrera está cerrada en ese momento, retrocede a retreatTo y
//               reintenta desde el paso retryStep.
//   'battery' -> nunca ataca por su cuenta: solo lo hace cuando la batería llega
//               a 0 (robot 1). Permanece quieto en su primera cámara.
export default class RouteEnemy extends Enemy {
  constructor({
    route,
    retreatTo = null,
    retryStep = null,
    attackWaitSec = 6,
    attackPolicy = 'attack',
    ...base
  }) {
    super({ ...base, location: 'camara', cameraIndex: route[0] });
    this.route = route;
    this.stepIndex = 0;
    this.retreatTo = retreatTo;
    this.retryStep = retryStep;
    this.attackWaitSec = attackWaitSec;
    this.attackPolicy = attackPolicy;
    // Cuenta atrás frente a la barrera (solo para attackPolicy 'attack').
    this.timer = 0;
    this.waiting = false;
  }

  get barrier() {
    return this.location === 'puerta' ? 'door' : 'window';
  }

  update(dt, ctx) {
    // Robot 1: la batería agotada lo manda a la barrera; ya allí espera
    // attackWaitSec y ataca (imposible de bloquear). No se mueve por tiradas.
    if (this.attackPolicy === 'battery') {
      if (this.location !== 'puerta') {
        if (ctx.batteryEmpty) {
          this.location = 'puerta';
          this.cameraIndex = null;
          this.waiting = true;
          this.timer = this.attackWaitSec;
        }
        return;
      }
      // Ya está en la puerta: cuenta atrás hasta el ataque.
      this.timer -= dt;
      if (this.timer <= 0) this.emitDefeat(ctx);
      return;
    }

    // Esperando frente a la puerta o la ventana.
    if (this.waiting) {
      this.timer -= dt;
      if (this.timer > 0) return;

      const barrierOpen = this.barrier === 'door' ? !ctx.doorClosed : !ctx.windowClosed;
      if (barrierOpen) {
        this.emitDefeat(ctx);
        return;
      }

      // Barrera cerrada: retrocede a la cámara indicada y reintenta desde ahí.
      this.waiting = false;
      this.location = 'camara';
      this.cameraIndex = this.retreatTo;
      this.stepIndex = this.retryStep;
      return;
    }

    // En cámara: solo avanza si la tirada global le tocó.
    if (ctx.advance) this.advance();
  }

  // Avanza un paso del recorrido (cámara siguiente o barrera de la oficina).
  advance() {
    const next = this.route[this.stepIndex + 1];
    if (next === undefined) return;

    this.stepIndex += 1;
    if (typeof next === 'number') {
      this.location = 'camara';
      this.cameraIndex = next;
      return;
    }

    this.location = next; // 'puerta' | 'ventana'
    this.cameraIndex = null;
    this.waiting = true;
    this.timer = this.attackWaitSec;
  }
}
