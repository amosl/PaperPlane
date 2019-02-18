/// <reference path="../../typings/phaser.d.ts" />
/// <reference path="../../typings/custom.d.ts" />

import 'phaser';
import '@babel/polyfill';

import SplashScreen from './scenes/splash-screen';
import Title from './scenes/title';
import GameScene from './scenes/game-scene';

const DEFAULT_WIDTH = 1136;
const DEFAULT_HEIGHT = 710;

const config = {
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  type: Phaser.AUTO,
  backgroundColor: '#555555',
  loaderPath: 'assets/',
  scene: [SplashScreen, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
}


window.addEventListener('load', () => {
  let game = new Phaser.Game(config);

  const resize = () => {
    const scale = Math.min(window.innerWidth / DEFAULT_WIDTH, window.innerHeight / DEFAULT_HEIGHT);
    game.canvas.style.width = DEFAULT_WIDTH * scale + 'px';
    game.canvas.style.height = DEFAULT_HEIGHT * scale + 'px';
  }

  resize();
  window.addEventListener('resize', resize);
})
