// Representa una puerta o ventana de la cabina (State simple: abierta/cerrada).
export default class Door {
  constructor(name = 'puerta') {
    this.name = name;
    this.closed = false;
  }

  toggle() {
    this.closed = !this.closed;
    return this.closed;
  }

  open() {
    this.closed = false;
  }

  close() {
    this.closed = true;
  }

  isClosed() {
    return this.closed;
  }
}
