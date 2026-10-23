// Reloj nocturno 12AM -> 6AM. Duración parametrizable (supuesto: 60s por hora).
export default class NightManager {
  constructor({ startHour = 0, endHour = 6, hourMs = 60000 } = {}) {
    this.startHour = startHour;
    this.endHour = endHour;
    this.hourMs = hourMs;
    this.elapsedMs = 0;
  }

  update(deltaMs) {
    this.elapsedMs += deltaMs;
  }

  getCurrentHour() {
    return Math.min(this.endHour, this.startHour + Math.floor(this.elapsedMs / this.hourMs));
  }

  // Formato FNAF: 12AM, 1AM ... 6AM
  getLabel() {
    const h = this.getCurrentHour();
    return h === 0 ? '12 AM' : `${h} AM`;
  }

  isFinished() {
    return this.getCurrentHour() >= this.endHour;
  }

  reset() {
    this.elapsedMs = 0;
  }
}
