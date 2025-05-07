class Controls extends Phaser.Scene {
    constructor() {
        super("controls");
        
        this.text = {};  
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        this.startGame = this.input.keyboard.addKey("R");
        this.credits = this.input.keyboard.addKey("H");

        this.add.text(20, 25, "A to move left", {
            fontFamily: 'Brush, serif',
            fontSize: 40,
            wordWrap: {
                width: 0
            }
        });
        this.add.text(20, 75, "D to move right", {
            fontFamily: 'Brush, serif',
            fontSize: 40,
            wordWrap: {
                width: 0
            }
        });
        this.add.text(20, 125, "Space to shoot", {
            fontFamily: 'Brush, serif',
            fontSize: 40,
            wordWrap: {
                width: 0
            }
        });

        this.add.text(175, 250, "Press R to start the game!", {
            fontFamily: 'Brush, serif',
            fontSize: 50,
            wordWrap: {
                width: 0
            }
        });

        this.add.text(270, 400, "Press H for credits", {
            fontFamily: 'Brush, serif',
            fontSize: 30,
            wordWrap: {
                width: 0
            }
        });
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(this.startGame)) {
            this.scene.stop("opening");
            this.scene.start("waveOne");
        }
        else if (Phaser.Input.Keyboard.JustDown(this.credits)){
            this.scene.stop("opening");
            this.scene.start("credits");
        }
    }
}