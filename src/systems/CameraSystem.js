// Índices 0-based de las 10 cámaras (mismo orden que la lista de abajo).
export const CAMERAS = {
  CABINA_IZQ: 0,
  CABINA_DER: 1,
  CAMINO: 2,
  AULA1: 3,
  AULA2: 4,
  EDIFICIO3: 5,
  PROFESORES_E4: 6,
  SALON_E4: 7,
  BIBLIOTECA: 8,
  PUERTA_E4: 9
};

// Sistema de cámaras: 10 cámaras nominales según GDD > "Descripción del juego".
export default class CameraSystem {
  constructor() {
    this.cameras = [
      { name: 'Cabina Izq.', key: 'camCabinaIzq' },
      { name: 'Cabina Der.', key: 'camCabinaDer' },
      { name: 'Camino cabina', key: 'camCamino' },
      { name: 'Aula 1', key: 'camAula1' },
      { name: 'Aula 2', key: 'camAula2' },
      { name: 'Edificio 3', key: 'camEdificio3' },
      { name: 'Profesores E4', key: 'camProfesoresE4' },
      { name: 'Salón E4', key: 'camSalonE4' },
      { name: 'Biblioteca', key: 'camBiblioteca' },
      { name: 'Puerta E4', key: 'camPuertaE4' }
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

  getActiveName() {
    return this.cameras[this.activeIndex].name;
  }

  getActiveKey() {
    return this.cameras[this.activeIndex].key;
  }
}
