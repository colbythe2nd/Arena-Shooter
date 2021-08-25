class playGame extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  create() {
    
    this.resources = 0;
    this.timer = 0;
    this.health = 3;
    this.invulnerable = false;
    this.stunned = false;
    this.spawnHowMany = 3;
    this.wave = 1;
    this.score = 0;
    this.waveTimer = 0;

    this.gameIsActive = true;

    this.regularFont = {
      fontFamily: 'font1',
      fontSize: 24,
      strokeThickness: 0,
      shadow: { stroke: true, fill: true, blur: 0, offsetX: 2, offsetY: 2, color: '#000000' },
      align: 'right',
    }
    this.scoreFont = {
      fontFamily: 'font1',
      fontSize: 48,
      strokeThickness: 0,
      shadow: { stroke: true, fill: true, blur: 0, offsetX: 2, offsetY: 2, color: '#000000' },
      align: 'right',
    }
    //Setting background image
    this.background = this.add.image(0, 0, "background")
    this.background.setOrigin(0,0)

//Hud Creation
    this.enemiesBox = this.add.text(48, 70, "", this.regularFont);
    this.waveBox = this.add.text(20, 47, "Level", this.regularFont);
    this.scoreBox = this.add.text(config.width - 90, 5, "0", this.scoreFont);
    this.healthIcons = this.add.group();
    this.renderHealth();
    this.skull = this.add.image(30, 82, "skull");
//Player physics
    this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
    //Keyboard input WASD addition
    this.cursorKeys = this.input.keyboard.addKeys(
      {up:Phaser.Input.Keyboard.KeyCodes.W,
      down:Phaser.Input.Keyboard.KeyCodes.S,
      left:Phaser.Input.Keyboard.KeyCodes.A,
      right:Phaser.Input.Keyboard.KeyCodes.D});
      //World Bounds for player
    this.player.setCollideWorldBounds(true);

//Projectiles group
    this.projectiles = this.add.group();
    //Enemies Groups
    this.enemyProjectiles = this.add.group();
    this.enemies = this.add.group();
    //Shoot on click
    this.input.on('pointerdown', function (pointer) {
      this.shootBeam();
    }, this);
//Starts enemy spawn
    this.startWave();

//Projectile physic logic
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.enemyProjectiles, this.player, this.hitPlayer, null, this);
//Checking for and creating high score in local storage
    if(localStorage.getItem('arenaShooterHighScore') === null){
      localStorage.setItem('arenaShooterHighScore', 0)
    } 
  }

  update(time, delta) {
    this.frameTime += delta

    for (var i = 0; i < this.projectiles.getChildren().length; i++) {
      var beam = this.projectiles.getChildren()[i];
      beam.update(this.gameIsActive);
    }
    for (var i = 0; i < this.enemyProjectiles.getChildren().length; i++) {
      var beam = this.enemyProjectiles.getChildren()[i];
      beam.update(this.gameIsActive);
    }

    this.timer += delta;
    while (this.timer > 100) {
      this.resources += 1;
      this.timer -= 100;
      for (var i = 0; i < this.enemies.getChildren().length; i++) {
        var enemy = this.enemies.getChildren()[i];
        enemy.update(this);
      }
      //Next wave starter
      if (this.gameIsActive) {
        if (this.enemies.countActive(true) == 0) {
          this.waveTimer++;
          if (this.waveTimer >= 3) {
            this.wave++;
            this.spawnHowMany += 2;
            this.waveTimer = 0;
            this.startWave();
          }
        }
        else {
          this.waveTimer = 0;
        }
      }
    }
    if (this.gameIsActive) {
      //Movement velocities
      this.angleVelocity = Math.atan2(
        this.input.mousePointer.y - this.player.y,
        this.input.mousePointer.x - this.player.x
      );
      this.angleVelocityDeg = (this.angleVelocity * 180) / Math.PI;
      //Menu Update
      this.enemiesBox.setText("x " + this.enemies.countActive(true));
      this.waveBox.setText("Level " + this.wave);
      this.scoreBox.setText(this.score);
      this.scoreBox.x = config.width - 20 - (this.scoreBox.width);
      //Player Manager
      this.movePlayerManager();
      this.rotatePlayer();

    }

  }
//Player movement logic
  movePlayerManager() {
    if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-gameSettings.playerSpeed);
    }
    else if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(gameSettings.playerSpeed);
    }
    else { 
      this.player.setVelocityX(0);
    }

    if (this.cursorKeys.up.isDown) {
      this.player.setVelocityY(-gameSettings.playerSpeed);
    }
    else if (this.cursorKeys.down.isDown) {
      this.player.setVelocityY(gameSettings.playerSpeed);
    }
    else { 
      this.player.setVelocityY(0);
    }
  }
//Player rotation logic
  rotatePlayer() {
    if (this.angleVelocityDeg > 120) {
      this.player.setFrame(0);
    }
    else if (this.angleVelocityDeg <= 120 && this.angleVelocityDeg > 60) {
      this.player.setFrame(1);
    }
    else if (this.angleVelocityDeg <= 60 && this.angleVelocityDeg > 0) {
      this.player.setFrame(2);
    }
    else if (this.angleVelocityDeg <= 0 && this.angleVelocityDeg > -60) {
      this.player.setFrame(3);
    }
    else if (this.angleVelocityDeg <= -60 && this.angleVelocityDeg > -120) {
      this.player.setFrame(4);
    }
    else if (this.angleVelocityDeg <= -120) {
      this.player.setFrame(5);
    }
  }
//Shoot function
  shootBeam() {
    var playerBullet = new PlayerBullet(this);
  }
//Create enemy function
  spawnEnemy(enemyX, enemyY) {
    if (this.gameIsActive) {
      var enemySpawn = new EnemySpawn(this, enemyX, enemyY);
    }
  }
//Enemy hit logic
  hitEnemy(projectile, enemy) {
    projectile.destroy();
    projectile.particles.destroy();
    //var explosion = new Explosion(this, enemy.x, enemy.y);
    enemy.enemyDamage(25, this);
  }
//Start new wave function
  startWave() {
    for (var i = 0; i < this.spawnHowMany; i++) {
      setTimeout(() => { this.spawnEnemy(config.width / 2, 50); }, 500 * i);
    }
  }
//Player hit function
  hitPlayer(projectile, player) {
    if (!this.invulnerable) {
      projectile.destroy();
      projectile.particles.destroy();
      this.player.tintFill = true;
      this.player.tint = 0x000000;
      setTimeout(() => { this.player.clearTint() }, 50);
      //var explosion = new Explosion(this, enemy.x, enemy.y);
      this.health--
      if (this.health <= 0) {
        this.endGame();
      }
      else {
        this.invulnerable = true;
        setTimeout(() => { this.invulnerable = false; }, 300);
      }
      this.renderHealth();
    }
  }
//End game
  endGame() {
    this.gameIsActive = false;
    this.player.destroy();
    this.deathBox = this.add.text(300, 300, "You Died");
   
    //Saving score to local storage if higher than previously saved score
    if (localStorage.getItem('arenaShooterHighScore') < this.score){
      localStorage.setItem('arenaShooterHighScore', this.score);
    }

    setTimeout(() => { this.scene.start("titleScreen"); }, 2000);
  }

  renderHealth() {
    this.healthIcons.clear(true, true);
    for (var i = 0; i < this.health; i++) {
      var healthIcon = this.healthIcons.create(35 + (i * 15), 30, "healthIcon");
    }
  }

}