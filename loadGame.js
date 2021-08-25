class loadGame extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }

  preload() {
    this.load.image("background", "assets/TestBackground.png");
    this.load.spritesheet("player", "assets/PlayerSprite.png", {frameWidth: 32, frameHeight: 64});
    this.load.spritesheet("enemy", "assets/EnemySprite.png", {frameWidth: 32, frameHeight: 64});
    //this.load.image("cursor", "assets/Reticle.png");
    //this.load.image('bullet', 'assets/Bullet.png');
    this.load.image("skull", "assets/skull.png");
    this.load.image("healthIcon", "assets/Health.png");
    this.load.spritesheet("bullet", "assets/Bullet_Friendly.png", {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet("enemyBullet", "assets/Bullet_Enemy.png", {frameWidth: 32, frameHeight: 32});
    this.load.atlas('flares', 'assets/flares.png', 'assets/flares.json');
    this.load.spritesheet("menu", "assets/Menu.png", {frameWidth: 124, frameHeight: 60});
  }

  create() {
    this.add.text(20, 20, "Loading Game");
    this.scene.start("titleScreen");

    this.anims.create({
      key: "bullet_anim",
      frames: this.anims.generateFrameNumbers("bullet"),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "bullet_enemy_anim",
      frames: this.anims.generateFrameNumbers("enemyBullet"),
      frameRate: 20,
      repeat: -1
    });

  }
}