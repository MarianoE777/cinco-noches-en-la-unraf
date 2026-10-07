// Batería parametrizable. Supuesto pendiente de GDD: consumos exactos no definidos.
export default class Battery {
  constructor(capacity = 100) {
    this.capacity = capacity;
    this.level = capacity;
  }

  // dt en segundos, extras: { door, window, cameras }
  drain(dtSeconds, { door = false, window = false, cameras = false } = {}) {
    const base = 0.15;
    const doorCost = door ? 0.6 : 0;
    const windowCost = window ? 0.6 : 0;
    const camCost = cameras ? 0.4 : 0;
    this.level = Math.max(0, this.level - (base + doorCost + windowCost + camCost) * dtSeconds);
    return this.level;
  }

  isEmpty() {
    return this.level <= 0;
  }

  reset() {
    this.level = this.capacity;
  }
}
