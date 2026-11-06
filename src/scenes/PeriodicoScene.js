import Phaser from 'phaser';
import { EN } from '../i18n/languages.js';
import { getLanguage } from '../i18n/translations.js';

// Escena intermedia entre el menú y la cabina: portada del periódico a pantalla completa,
// sin texto encima. Cualquier tecla o clic del mouse avanza a la cabina. (Ampliación fuera del GDD.)
export default class PeriodicoScene extends Phaser.Scene {
  constructor() {
    super('PeriodicoIntro');
  }

  create() {
    // El periódico cambia según el idioma: español = mejorado, inglés = empeorado.
    const texture = getLanguage() === EN ? 'periodico_en' : 'periodico_es';
    const fondo = this.add.image(480, 300, texture);
    // Cubrir el lienzo 960x600 sin deformar la imagen (recorta el sobrante).
    const escala = Math.max(960 / fondo.width, 600 / fondo.height);
    fondo.setScale(escala);

    const avanzar = () => this.scene.start('Nivel1');
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown', avanzar);
    }
    this.input.once('pointerdown', avanzar);
  }
}
