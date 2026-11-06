import Phaser from 'phaser';
import UiButton from '../ui/UiButton.js';
import { EN } from '../i18n/languages.js';
import { getLanguage, getPhrase } from '../i18n/translations.js';

// Cada punto del texto original se muestra como un párrafo separado.
const PARAGRAPHS_ES = [
  'TUTORIAL, estarás dentro de una sala de seguridad donde habrá una ventana y una puerta, con una persiana y puerta metálicas y luz para poder ver, también contaras con cámaras en la parte inferior, tu objetivo es sobrevivir hasta las 6 de la mañana y evitar que se te termine la batería, los profesores que están en la escuela irán por ti, aquí te dejo como detenerlos.',
  'Profe Nico, no atacara hasta que se termine la batería.',
  'Profe Andrés, se moverá asta la ventana de la sala de seguridad, una vez hay si no cierras la ventana con el botón rojo que esta al lado, te pondrá exámenes asta la muerte, para saber si esta en la ventana te conviene prender la luz, sino se vera todo negro.',
  'Profe Girafales, lo mismo que el Profe Andrés pero por la puerta.',
  'Profe Walter White, aparecerá muy rara vez en la sala, pero si tienes suerte quizás lo veas, se va si activas las cámaras.',
  'Profe Snape, se canso del mundo mágico y vino a reprobarte, estará solo en su salón, a lo lejos, pero se ira acercando a la puerta de su salón, hasta que ya no este, si no cierras la ventana cuando lo pierdas de vista te atrapara.',
  'suerte en el trabajo y recuerda, no cobraras si no completas las 5 noches.'
];

// En Traducila el tutorial está cargado como una sola key formada por los
// párrafos entre comillas y separados por espacios. Se reconstruye igual para
// poder buscar la traducción y después volver a separarla en párrafos.
const TUTORIAL_KEY = PARAGRAPHS_ES.map((parrafo) => `'${parrafo}'`).join(',       ');

function getTutorialParagraphs() {
  if (getLanguage() !== EN) return PARAGRAPHS_ES;

  const translated = getPhrase(TUTORIAL_KEY);
  if (translated === TUTORIAL_KEY) return PARAGRAPHS_ES;

  return translated
    .split(/'\s*,\s*'/)
    .map((parrafo) => parrafo.replace(/^'+|'+$/g, '').trim())
    .filter(Boolean);
}

export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super('Tutorial');
  }

  create() {
    const parrafos = getTutorialParagraphs();

    this.add
      .text(480, 32, getPhrase('TUTORIAL', 'TUTORIAL'), {
        fontSize: '30px',
        color: '#ffcf5a'
      })
      .setOrigin(0.5);

    this.add.text(40, 68, parrafos.join('\n'), {
      fontSize: '17px',
      color: '#ffffff',
      lineSpacing: 6,
      wordWrap: { width: 880 }
    });

    const volver = () => this.scene.start('MenuInicio');

    new UiButton(this, {
      x: 480,
      y: 565,
      label: getPhrase('VOLVER AL MENÚ', 'BACK TO MENU'),
      shortcut: 'ESC',
      onDown: volver
    });

    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-ESC', volver);
    }
  }
}
