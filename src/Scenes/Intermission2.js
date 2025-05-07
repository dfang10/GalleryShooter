class Intermission2 extends Phaser.Scene {
    constructor() {
        super("intermission2");
        
        this.text = {};  
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        this.restartGame = this.input.keyboard.addKey("R");

        this.add.text(175, 250, "Level two complete!", {
            fontFamily: 'Brush, serif',
            fontSize: 50,
            wordWrap: {
                width: 0
            }
        });

        this.add.text(185, 320, "Press R to restart game", {
            fontFamily: 'Brush, serif',
            fontSize: 30,
            wordWrap: {
                width: 0
            }
        });
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(this.restartGame)) {
            this.scene.stop("intermission2");
            this.scene.start("waveOne");
        }
    }
}