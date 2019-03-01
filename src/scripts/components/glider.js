/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable quotes */

/* global Phaser */


const GlideStates = Object.freeze({
  IDLE: Symbol("idle"),
  LAUNCH: Symbol("launch"),
  DIVE: Symbol("dive"),
  DRIFT: Symbol("drift")
});

//
//
class Glider extends Phaser.GameObjects.Sprite
{
  /**
   * Glider class
   *
   *  @extends Phaser.GameObjects.Sprite
   */
  constructor(scene) {
    super(scene, 0, 0, 'glider');

    this.setOrigin(0.5);

    // Physics
    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.body.setGravityY(0);
    this.body.setBounceY(0.2);
    
    this.resetPosition();
  }

  /**
   *  Reset all states to start position
   */
  resetPosition() {
    this.setPosition(100, 400);
    this.rotation=  -Phaser.Math.TAU / 4;
    this.body.setGravityY(0);

    this.setState(GlideStates.IDLE);
  }

  // Apply a momentary force to simulate impluse 
  applyImpulseForce(forceVec, duration=1) {
    this.body.setAcceleration(forceVec.x, forceVec.y);
    this.scene.time.delayedCall(duration*1000, () => this.body.setAcceleration(0,0));
  }

  setState(val) {
    this.curState= val;
  }

  // 
  launch(force) {
    console.log("Launch with force: " + force);
    this.curState= GlideStates.LAUNCH;
    this.body.setGravityY(200);

    let forceDir = new Phaser.Math.Vector2();
    forceDir.set(1/2, -1.7320/2);
    forceDir.scale(force);

    this.applyImpulseForce(forceDir, 1.1);
    
  }


  resetForces() {
    this.body.setAcceleration(0,0);
  }

  stop(delaySec=0) {
    if (delaySec==0) {
      this.rotation =0;
      this.body.stop();
      this.scene.events.emit('roundComplete');

      return;
    }
      
    this.scene.time.delayedCall(delaySec*1000, ()=> {
      this.rotation =0;
      this.body.stop();
      this.scene.events.emit('roundComplete');
    } );
      
  }

  /**
   * Smooth Rotation
   * @param {*} dt 
   */
  updateRotation(dt) {
    const dir= this.body.velocity;
    const step = dt * 0.001 * 5; // convert to sec
    const targetRot = Phaser.Math.Angle.Wrap( dir.angle());

    // Update the rotation smoothly.
    if ( dir.x > 0.05) {
      this.rotation = Phaser.Math.Linear(this.rotation, targetRot, step);
    }
  }

  update(t, dt)  {
    
    this.updateRotation(dt);


    if (this.curState === GlideStates.IDLE)
      return;

    const wasColliding = this.body.wasTouching.down;
    const isColliding = this.body.touching.down;
    const upward = this.body.velocity.y < 0;

    if (!this.up !== upward) {
      this.setState(upward==true? GlideStates.PULL : GlideStates.DIVE);
    }

    if (isColliding && !wasColliding) {
      //this.completeDive(true);
      this.stop(1.0);
      this.setState(GlideStates.IDLE);
      
    }
     
    this.up = upward;
  }


}

export default Glider;
