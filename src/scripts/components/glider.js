/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable quotes */


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
    this.body.setFriction(400, 0);
    
    this.resetPosition();
  }

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


  pullUp() {
    this.curState= GlideStates.PULL;

    let pull= new Phaser.Math.Vector2(1,-5);
    pull.normalize();
    pull.scale(350);
    console.log("PullUp: alt=" + this.y);
    this.targetAlt= 150 + this.y;
   
    this.body.setAcceleration(pull.x, pull.y);
  }


  completeDive(stop=false)   {
    if (stop)
      console.log("Stop");
    else
      console.log("Complete: alt=" + this.y);
    
    this.curState= GlideStates.IDLE;
    this.resetForces();
    if (stop) {
      this.body.stop();
    }
  }

  resetForces() {
    this.body.setAcceleration(0,0);
  }

  stop(delaySec=0) {
    if (delaySec==0) {
      this.body.stop();
      this.scene.events.emit('roundComplete');

      return;
    }
      
    this.scene.time.delayedCall(delaySec*1000, ()=> {
      this.body.stop();
      this.scene.events.emit('roundComplete');
    } );
      
  }

  updateRotation(dt) {
    const dir= this.body.velocity;
    const mag = dir.lengthSq();
    const step = dt * 0.001 * 2; // convert to sec
    const targetRot = Phaser.Math.Angle.Wrap( dir.angle());

    // Update the rotation smoothly.
    if (mag > 0.01) {
      this.rotation = Phaser.Math.Linear(this.rotation, targetRot, step);
    }
  }

  update(t, dt)  {
    super.update(t, dt);

    console.log("Glider update " + t);
  }


  preUpdate(t, dt) {
    super.preUpdate(t, dt);

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
