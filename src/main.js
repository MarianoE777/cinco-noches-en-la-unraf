import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene.js';
import PeriodicoScene from './scenes/PeriodicoScene.js';
import OfficeScene from './scenes/OfficeScene.js';
import WinScene from './scenes/WinScene.js';
import LoseScene from './scenes/LoseScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 600,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [MenuScene, PeriodicoScene, OfficeScene, WinScene, LoseScene]
};

// eslint-disable-next-line no-new
new Phaser.Game(config);
