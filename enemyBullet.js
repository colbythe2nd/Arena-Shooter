class EnemyBullet extends Phaser.GameObjects.Sprite{
  constructor(scene, enemy) {

    var x = enemy.x;
    var y = enemy.y;

    var bulletSpeed = 400;

    super(scene, x, y, "enemyBullet");
    scene.add.existing(this);
    
    scene.physics.world.enableBody(this);
    this.body.velocity.x = Math.cos(enemy.enemyAngleVelocityShoot) * bulletSpeed;
    this.body.velocity.y = Math.sin(enemy.enemyAngleVelocityShoot) * bulletSpeed;

    scene.enemyProjectiles.add(this);

    this.particles = scene.add.particles('flares');

    this.particles.createEmitter({
        frame: 'red',
        x: 0,
        y: 0,
        lifespan: 150,
        speed: { min: 400, max: 600 },
        angle: enemy.enemyAngleVelocityDegShoot + 180,
        gravityY: 300,
        scale: { start: 0.1, end: 0 },
        quantity: 2,
        blendMode: 'ADD'
    });

    this.particles.setPosition(this.x, this.y);

    this.play("bullet_enemy_anim");
  }

  update(gameIsActive) {
    this.particles.setPosition(this.x, this.y);
    if(this.x <= 0 || this.x >= config.width || this.y <= 0 || this.y >= config.height) {
      this.destroy();
      this.particles.destroy();
    }
    if(!gameIsActive) {
      this.destroy();
      this.particles.destroy();
    }
  }

  destroyProjectile(){
    this.destroy();
    this.particles.destroy();
  }
}