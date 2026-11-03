import Enemy from './Enemy.js';

// Robot 5: se queda en la cámara 6 (Edificio 3). Sigue la misma mecánica de
// números que los robots 2 y 3, pero en lugar de cambiar de cámara cambia de fase.
//   Fase 1: 1/4 del tamaño normal.
//   Fase 2: 1/2 del tamaño normal.
//   Fase 3: tamaño normal.
//   Fase 4: desaparece de la cámara y arranca la cuenta final (10 s). Si al
//           terminar la ventana está cerrada vuelve a la fase 1; si está
//           abierta, ataca.
// Nunca aparece en la ventana.
export default class Edificio3Enemy extends Enemy {
  constructor({ cameraIndex, finalCountdownSec = 10, ...base }) {
    super({ ...base, location: 'camara', cameraIndex });
    this.finalCountdownSec = finalCountdownSec;
    this.phase = 1;
    this.timer = 0;
  }

  get phaseScale() {
    return { 1: 0.25, 2: 0.5, 3: 1, 4: 0 }[this.phase] ?? 0;
  }

  isInCamera(index) {
    return super.isInCamera(index) && this.phase < 4;
  }

  update(dt, ctx) {
    if (this.phase < 4) {
      // Solo cambia de fase cuando la tirada global le toca.
      if (ctx.advance) this.phase += 1;
      return;
    }

    // Fase 4: cuenta final de 10 s para cerrar la ventana.
    this.timer += dt;
    if (this.timer >= this.finalCountdownSec) {
      if (ctx.windowClosed) {
        this.phase = 1;
        this.timer = 0;
      } else {
        this.emitDefeat(ctx);
      }
    }
  }
}
