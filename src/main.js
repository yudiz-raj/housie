import config from './scripts/config';
import Phaser from 'phaser';
import Preload from './scenes/Preload';
import Level from './scenes/Level';

class Boot extends Phaser.Scene {
  preload() {
    this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("Preload"));
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game({
    title: 'Housie',
    version: config.version,
    width: config.width,
    height: config.height,
    type: Phaser.AUTO,
    backgroundColor: '#333',
    transparent: true,
    parent: "game-division",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    audio: {
      disableWebAudio: false
    },
    dom: {
      createContainer: true
    },
    scene: [Boot, Preload, Level],
  });
});