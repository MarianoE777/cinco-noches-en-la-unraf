// Sistema de cámaras: 10 cámaras nominales según GDD > "Descripción del juego".
export default class CameraSystem {
  constructor() {
    this.cameras = [
      'Cabina Izq.',
      'Cabina Der.',
      'Camino cabina',
      'Aula 1',
      'Aula 2',
      'Edificio 3',
      'Profesores E4',
      'Salón E4',
      'Biblioteca',
      'Puerta E4'
    ];
    this.visible = false;
    this.activeIndex = 0;
  }

  toggle() {
    this.visible = !this.visible;
    return this.visible;
  }

  next() {
    this.activeIndex = (this.activeIndex + 1) % this.cameras.length;
  }

  prev() {
    this.activeIndex = (this.activeIndex - 1 + this.cameras.length) % this.cameras.length;
  }

  getActive() {
    return this.cameras[this.activeIndex];
  }
}
