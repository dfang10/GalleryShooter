class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
        
        this.text = {};  
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        this.restartGame = this.input.keyboard.addKey("T");

        this.add.text(175, 250, "Game Over", {
            fontFamily: 'Brush, serif',
            fontSize: 100,
            wordWrap: {
                width: 0
            }
        });

        this.add.text(230, 350, "Press T to restart", {
            fontFamily: 'Brush, serif',
            fontSize: 50,
            wordWrap: {
                width: 0
            }
        });
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(this.restartGame)) {
            this.scene.stop("gameOver");
            this.scene.start("waveOne");
        }
    }
}