// Estado de una luz de cabina: prendida / apagada (State simple, mismo contrato que Door).
export default class Light {
  constructor(name = 'luz') {
    this.name = name;
    this.on = false;
  }

  toggle() {
    this.on = !this.on;
    return this.on;
  }

  isOn() {
    return this.on;
  }
}
