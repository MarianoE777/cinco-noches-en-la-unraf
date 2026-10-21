import Enemy from './Enemy.js';
import { ALUCINATION_ROLL } from './EnemyAI.js';

// Robot 4 (GDD > "Funcionamiento de los enemigos"): con baja probabilidad
// aparece dentro de la cabina. El disparador es que la tirada global sea
// exactamente 1; entonces hace su propia tirada 0..1 y, si sale 1, aparece en
// la oficina. A los 5 s ataca, salvo que el jugador abra las cámaras: en ese
// caso desaparece y queda habilitado para volver a aparecer más adelante.
export default class HallucinationEnemy extends Enemy {
  constructor({ appearDelaySec = 5, ...base }) {
    super({ ...base, location: 'oculto' });
    this.appearDelaySec = appearDelaySec;
    this.timer = 0;
  }

  update(dt, ctx) {
    if (this.location === 'oficina') {
      // Ver las cámaras lo hace desaparecer (GDD).
      if (ctx.camsVisible) {
        this.location = 'oculto';
        this.timer = 0;
        return;
      }

      this.timer -= dt;
      if (this.timer <= 0) this.emitDefeat(ctx);
      return;
    }

    // Disparador: la tirada global del ciclo fue exactamente 1 (GDD).
    if (ctx.advance && ctx.globalRoll === ALUCINATION_ROLL) {
      const roll = Math.random() < 0.5 ? 0 : 1; // tirada 0..1
      if (roll === 1) {
        this.location = 'oficina';
        this.timer = this.appearDelaySec;
      }
    }
  }
}
