// Batería parametrizable. Supuesto pendiente de GDD: consumos exactos no definidos.
export default class Battery {
  constructor(capacity = 100) {
    this.capacity = capacity;
    this.level = capacity;
  }

  // dt en segundos, extras: { door, window, cameras, lights, multiplier }.
  // lights: cantidad de luces prendidas (supuesto: 0.125 %/s por luz, acordado con el usuario).
  // multiplier: factor extra del robot 1 según su número propio (GDD: 1.0 / 1.01 / 1.015 / 1.02).
  // Consumos reducidos a la mitad (antes: base 0.15, puerta/ventana 0.6, cámaras 0.4, luces 0.25).
  // Ajuste posterior por margen de error: puerta/ventana otro -1/3 y cámaras otro -1/4.
  drain(dtSeconds, { door = false, window = false, cameras = false, lights = 0, multiplier = 1 } = {}) {
    const base = 0.075;
    const doorCost = door ? 0.2 : 0;
    const windowCost = window ? 0.2 : 0;
    const camCost = cameras ? 0.15 : 0;
    const lightsCost = lights * 0.125;
    const cost = (base + doorCost + windowCost + camCost + lightsCost) * multiplier;
    this.level = Math.max(0, this.level - cost * dtSeconds);
    return this.level;
  }

  isEmpty() {
    return this.level <= 0;
  }

  reset() {
    this.level = this.capacity;
  }
}
