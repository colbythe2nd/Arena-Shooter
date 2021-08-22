class EnemySpawn extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y) {

    var x = x;
    var y = y;

    super(scene, x, y, "enemy");
    scene.add.existing(this);
    
    scene.physics.world.enableBody(this);

    scene.enemies.add(this);

    this.shootTimer = 0;
    this.timeBetweenShots = (Math.random() * 5) + 15;
    this.burstFire = false;
    this.burstFireShots = 0;
    this.inaccuracyMultiplier = 0.5;

    this.movementSpeed = 50;
    this.health = 100;

    this.spawnMovementTimer = 0;
    this.spawnMovementMax = 10;
    this.spawnMovementSpeed = 80;
    this.enemySpawnAngle = ((Math.random() * 160) + 10) / 180 * Math.PI;
  }

  update(scene) {
    this.shootTimer++
    if (this.shootTimer >= this.timeBetweenShots) {
      if (this.burstFire) {
        this.burstFireShots++
        this.enemyShoot(scene)
        if (this.burstFireShots >= 3) {
          this.shootTimer = 0;
          this.burstFireShots = 0;
        }
      }
      else {
        this.enemyShoot(scene)
        this.shootTimer = 0;
      }
    }

    var currentSpeed;
    //Angles are reversed, flip them to face player
    if (this.spawnMovementTimer <= this.spawnMovementMax) {
      this.spawnMovementTimer++
      this.enemyAngleVelocity = this.enemySpawnAngle;
      currentSpeed = this.spawnMovementSpeed;
    }
    else {
      this.enemyAngleVelocity = ((Math.atan2(this.y - scene.player.y, this.x - scene.player.x) + (2 * Math.PI)) % (2 * Math.PI)) - Math.PI;
      currentSpeed = this.movementSpeed;
    }
    this.enemyAngleVelocityDeg = (this.enemyAngleVelocity) * 180 / Math.PI;
    this.enemyAngleVelocityShoot = this.enemyAngleVelocity + ((Math.random() - 0.5) * this.inaccuracyMultiplier);
    this.enemyAngleVelocityDegShoot = (this.enemyAngleVelocityShoot) * 180 / Math.PI;

    this.rotateEnemyToPlayer()

    this.body.velocity.x = Math.cos(this.enemyAngleVelocity) * currentSpeed;
    this.body.velocity.y = Math.sin(this.enemyAngleVelocity) * currentSpeed;

    if(this.x <= 0 || this.x >= config.width || this.y <= 0 || this.y >= config.height) {
      this.destroy();
    }
    if (!scene.gameIsActive) {
      this.destroy();
    }
  }

  rotateEnemyToPlayer() {
    if (this.enemyAngleVelocityDeg > 120) {
      this.setFrame(0);
    }
    else if (this.enemyAngleVelocityDeg <= 120 && this.enemyAngleVelocityDeg > 60) {
      this.setFrame(1);
    }
    else if (this.enemyAngleVelocityDeg <= 60 && this.enemyAngleVelocityDeg > 0) {
      this.setFrame(2);
    }
    else if (this.enemyAngleVelocityDeg <= 0 && this.enemyAngleVelocityDeg > -60) {
      this.setFrame(3);
    }
    else if (this.enemyAngleVelocityDeg <= -60 && this.enemyAngleVelocityDeg > -120) {
      this.setFrame(4);
    }
    else if (this.enemyAngleVelocityDeg <= -120) {
      this.setFrame(5);
    }
  }

  enemyShoot(scene) {
    var enemyBullet = new EnemyBullet(scene, this);
  }

  enemyDamage(damageTaken, scene) {
    this.health -= damageTaken;
    this.tintFill = true;
    this.tint = 0x000000;
    setTimeout(() => { this.clearTint() }, 50);
    if (this.health <= 0) {
      this.destroy();
      scene.score += 100;
    }
  }
}