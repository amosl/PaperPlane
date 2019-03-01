import Glider from '../components/glider';

/* eslint-disable no-alert, no-console */
/* eslint-disable no-unused-vars */

/* global Phaser */



class GameScene extends Phaser.Scene {
  /**
   *  A sample Game scene, displaying the Phaser logo.
   *
   *  @extends Phaser.Scene
   */
  constructor() {
    super({key: 'Game'});
  }



  /**
   *  Called when a scene is initialized. Method responsible for setting up
   *  the game objects of the scene.
   *
   *  @protected
   *  @param {object} data Initialization parameters.
   */
  create(/* data */) {

    let gameW= this.sys.game.config.width;
    let gameH= this.sys.game.config.height;
    let worldSizeW = gameW*2;

    console.log('Screen size: ' + gameW +'x' + gameH);

    // Sky Background
    let skyBg = this.add.tileSprite(0, 0, worldSizeW, gameH, 'skyTile');
    skyBg.setOrigin(0, 0);

    let platforms = this.physics.add.staticGroup();

    // Ground
    let ground= this.add.tileSprite(0,0, worldSizeW, 64, 'grass');
    ground.setOrigin(0,0);
    ground.setPosition(0, gameH-60);
    platforms.add(ground);

    this.add.image(gameW-200, gameH-100, 'redFlag');
    this.add.image(worldSizeW*0.8, gameH-100, 'greenFlag');

    this.glider = new Glider(this);
   
    // Set a collision check for the ground
    this.physics.add.collider(this.glider, platforms);

    this.cameras.main.setBounds(0, 0, worldSizeW, gameH);
    this.cameras.main.startFollow(this.glider, true, 0.5, 0.5 );
    
    this.createUI(gameH, gameH);
    this.resetScene();
    

  }

  createUI(w, h) {

    this.btnGo= this.createTextButton(100, h-30, 'GO', () => this.launch());
    this.btnRetry= this.createTextButton(100, h-30, 'Retry', () => this.resetScene());
  }

  createTextButton(x, y, caption, callback) {
    
    const label= this.add.text(x, y, caption, {
      font: '32px Impact',
      color: 'yellow',
      stroke:'black',
      strokeThickness: 6
    });

    label.setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setInteractive();

    label.on('pointerup', callback);

    return label;
  }

  resetScene() {
    this.glider.resetPosition();

    this.btnRetry.setVisible(false);
    this.btnGo.setVisible(true);
  }

  launch() {
    this.events.once('roundComplete', () => this.onComplete());
    this.glider.launch(500);

    this.btnGo.setVisible(false);
    this.btnRetry.setVisible(false);
  }

  onComplete() {
    console.log("Round Complete!");
    
    this.btnRetry.setVisible(true);
    this.btnGo.setVisible(false);
  }
  
  /**
   *  Called when a scene is updated. Updates to game logic, physics and game
   *  objects are handled here.
   *
   *  @protected
   *  @param {number} t Current internal clock time.
   *  @param {number} dt Time elapsed since last update.
   */
  update( t, dt ) {
   
    this.glider.update(t, dt);
  }
}

export default GameScene;
