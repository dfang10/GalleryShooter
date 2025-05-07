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
        this.startGame = this.input.keyboard.addKey("R");
        this.controls = this.input.keyboard.addKey("C");
        this.credits = this.input.keyboard.addKey("H");

        this.add.text(180, 250, "Hive defender", {
            fontFamily: 'Brush, serif',
            fontSize: 50,
            wordWrap: {
                width: 0
            }
        });

        this.add.text(200, 350, "Press R to start the game!", {
            fontFamily: 'Brush, serif',
            fontSize: 30,
            wordWrap: {
                width: 0
            }
        });

        this.add.text(200, 400, "Press C for controls", {
            fontFamily: 'Brush, serif',
            fontSize: 30,
            wordWrap: {
                width: 0
            }
        });

        this.add.text(200, 450, "Press H for credits", {
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
        else if (Phaser.Input.Keyboard.JustDown(this.credits)){
            this.scene.stop("opening");
            this.scene.start("credits");
        }
    }
}