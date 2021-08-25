class titleScreen extends Phaser.Scene {
  constructor() {
    super("titleScreen");
  }

  create() {
    this.add.text(20, 20, "Title Screen");
    this.background = this.add.image(0, 0, "background")
    this.background.setOrigin(0,0)
    this.highScoreToDisplay = 0;
    this.gameOverText = 0;
    this.start = this.add.sprite(config.width / 2, config.height / 3 , "menu" , 0);
    this.highScore = this.add.sprite(config.width / 2, config.height / 3 + 80, "menu" , 1);
    this.credits = this.add.sprite(config.width / 2, config.height / 3 + 160, "menu" , 2);

    //Player high score from local storage
    if(localStorage.getItem('arenaShooterHighScore') !== null){
      this.highScoreToDisplay = parseInt(localStorage.getItem('arenaShooterHighScore'));
      this.gameOverText = this.add.text(config.width / 2 - 30, 270, this.highScoreToDisplay.toString(), {
        fontFamily: 'font1',
        fontSize: 24,
        color: '#000000',
        strokeThickness: 0,
      });
    }
    
    

    this.start.name = "start";
    this.highScore.name = "highscore";
    this.credits.name = "credits";

    this.start.setInteractive();
    this.highScore.setInteractive();
    this.credits.setInteractive();
    
  
//Start Game on click
    this.input.on('gameobjectdown', this.clickEvent, this);
  }

  clickEvent(pointer, gameObject) {
    if (gameObject.name == "start") {
      this.scene.start("playGame");
    }
    
  }
}