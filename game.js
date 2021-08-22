var gameSettings = {
  playerSpeed: 200
}

var config = {
  width: 800,
  height: 600,
  parent: 'game',
  //autoCenter: Phaser.Scale.CENTER_BOTH,
  backgroundColor: 0x000000,
  scene: [loadGame, titleScreen, playGame],
  pixelArt: true,
  //zoom: 5,
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scale: {
    //mode: Phaser.Scale.FIT,
    // ...
  }
}

window.onload = function() {
  var game = new Phaser.Game(config);
}