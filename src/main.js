import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene.js';
import TutorialScene from './scenes/TutorialScene.js';
import PeriodicoScene from './scenes/PeriodicoScene.js';
import Level1Scene from './scenes/Level1Scene.js';
import Level2Scene from './scenes/Level2Scene.js';
import Level3Scene from './scenes/Level3Scene.js';
import Level4Scene from './scenes/Level4Scene.js';
import Level5Scene from './scenes/Level5Scene.js';
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
  scene: [MenuScene, TutorialScene, PeriodicoScene, Level1Scene, Level2Scene, Level3Scene, Level4Scene, Level5Scene, WinScene, LoseScene]
};

// eslint-disable-next-line no-new
new Phaser.Game(config);
