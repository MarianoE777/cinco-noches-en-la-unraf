import Phaser from 'phaser';
import UiButton from '../ui/UiButton.js';
import { EN, ES } from '../i18n/languages.js';
import {
  getLanguage,
  getPhrase,
  loadTranslations,
  setLanguage
} from '../i18n/translations.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuInicio');
  }

  preload() {
    // Se cargan las dos portadas: el periódico cambia según el idioma elegido.
    this.load.image('periodico_es', 'assets/periodico_laburo_mejorado.png');
    this.load.image('periodico_en', 'assets/periodico_laburo_empeorado.png');
  }

  async create() {
    this.isChangingLanguage = false;

    const loading = this.add
      .text(480, 300, '', { fontSize: '18px', color: '#aaa' })
      .setOrigin(0.5);

    // Si el idioma guardado es inglés, esperamos las traducciones antes de pintar el menú.
    if (getLanguage() === EN) {
      loading.setText('Loading...');
      try {
        await loadTranslations(EN);
      } catch (error) {
        console.warn('No se pudieron cargar las traducciones de Traducila.', error);
      }
    }

    loading.destroy();
    this.buildMenu();
  }

  buildMenu() {
    const language = getLanguage();

    this.add
      .text(480, 180, getPhrase('CINCO NOCHES EN LA UNRAF', 'FIVE NIGHTS AT UNRAF'), {
        fontSize: '36px',
        color: '#fff'
      })
      .setOrigin(0.5);
    this.add
      .text(
        480,
        260,
        getPhrase(
          'Guardia nocturno – sobrevive hasta las 6 AM',
          'Night guard – survive until 6 AM'
        ),
        { fontSize: '18px', color: '#aaa' }
      )
      .setOrigin(0.5);

    const jugar = () => this.scene.start('PeriodicoIntro');
    const verTutorial = () => this.scene.start('Tutorial');
    const cambiarIdioma = () => this.toggleLanguage();

    new UiButton(this, {
      x: 480,
      y: 350,
      label: getPhrase('JUGAR', 'PLAY'),
      shortcut: 'ENTER',
      onDown: jugar
    });
    new UiButton(this, {
      x: 480,
      y: 400,
      label: getPhrase('TUTORIAL', 'TUTORIAL'),
      shortcut: 'T',
      onDown: verTutorial
    });
    new UiButton(this, {
      x: 480,
      y: 460,
      label: language === EN ? 'LANGUAGE: ENGLISH' : 'IDIOMA: ESPAÑOL',
      shortcut: 'I',
      onDown: cambiarIdioma
    });

    this.input.keyboard.on('keydown-ENTER', jugar);
    this.input.keyboard.on('keydown-SPACE', jugar);
    this.input.keyboard.on('keydown-T', verTutorial);
    this.input.keyboard.on('keydown-I', cambiarIdioma);
  }

  async toggleLanguage() {
    if (this.isChangingLanguage) return;

    const nextLanguage = getLanguage() === EN ? ES : EN;
    this.isChangingLanguage = true;
    this.input.enabled = false;

    if (nextLanguage === EN) {
      this.add
        .text(480, 520, 'Loading...', { fontSize: '16px', color: '#aaa' })
        .setOrigin(0.5);
      try {
        await loadTranslations(EN);
      } catch (error) {
        console.warn('No se pudieron cargar las traducciones de Traducila.', error);
      }
    }

    setLanguage(nextLanguage);
    this.scene.restart();
  }
}
