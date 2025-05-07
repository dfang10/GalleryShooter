class Credits extends Phaser.Scene {
    constructor() {
        super("credits");
        
        this.text = {};  
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        this.startGame = this.input.keyboard.addKey("R");
        this.controls = this.input.keyboard.addKey("C");

        this.add.text(20, 25, "Assets and sounds: Kenny", {
            fontFamily: 'Brush, serif',
            fontSize: 40,
            wordWrap: {
                width: 0
            }
        });
        this.add.text(20, 75, "Original code adapted from Jim Whitehead", {
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

        this.add.text(270, 350, "Press C for controls", {
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
        else if (Phaser.Input.Keyboard.JustDown(this.controls)){
            this.scene.stop("opening");
            this.scene.start("controls");
        }
    }
}