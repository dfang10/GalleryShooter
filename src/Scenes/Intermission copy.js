class Opening extends Phaser.Scene {
    constructor() {
        super("opening");
        
        this.text = {};  
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        this.restartGame = this.input.keyboard.addKey("R");

        this.add.text(175, 250, "Level one complete!", {
            fontFamily: 'Brush, serif',
            fontSize: 50,
            wordWrap: {
                width: 0
            }
        });

        this.add.text(185, 320, "Press R to proceed to next level", {
            fontFamily: 'Brush, serif',
            fontSize: 30,
            wordWrap: {
                width: 0
            }
        });
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(this.restartGame)) {
            this.scene.stop("intermission");
            this.scene.start("waveTwo");
        }
    }
}