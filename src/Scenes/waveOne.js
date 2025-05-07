class WaveOne extends Phaser.Scene {
    constructor(){
        super("waveOne");
        this.my = {sprite: {}, text: {}};
        this.initGame();
    }

    initGame(){ // Initial variables of the game
        this.my.sprite.bullet = [];   
        this.my.sprite.flies = [];
        this.playerSpeed = 15;
        this.bulletSpeed = 25;
        this.maxBullets = 3; 
        this.myLives = 3;
        this.collisionCooldown = false;
        this.cooldownTime = 500;
        this.myScore = 0;
    }

    preload() { // Load assets
        this.load.setPath("./assets/");
        this.load.image("bee", "bee_fly.png"); // Player
        this.load.image("laser", "laserRed04.png"); // Projectile
        this.load.image("fly", "fly_fly.png");// Fly enemy
        this.load.image("bee_hit", "bee_hit.png"); // Player hit
        this.load.image("fly_hit", "fly_hit.png"); // Fly hit

        this.load.audio("laserS", "laserSmall_003.ogg"); // Projectile sound
        this.load.audio("defeatE", "explosionCrunch_002.ogg"); // Enemy defeat sound
        this.load.audio("hit1", "scratch_005.ogg"); // Player hit sound
        this.load.audio("baseHit", "doorOpen_002.ogg"); // Enemy reaches end

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt"); // Text font
    }

    create() {
        this.initGame();
        let my = this.my;

        my.text.score = this.add.bitmapText(20,0, "rocketSquare", "Score " + this.myScore)

        this.anims.create({ // Player getting hit
            key: "damageBee",
            frames: [
                { key: "bee_hit"},
            ],
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });

        this.anims.create({ // Fly getting hit
            key: "damageFly",
            frames: [
                { key: "fly_hit"},
            ],
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });

        // Path setup
        this.points = [ 
            game.config.width/2, game.config.height - 600,
            game.config.width/2, game.config.height
        ];
        this.curve = new Phaser.Curves.Spline(this.points); 
        this.graphics = this.add.graphics();
        this.drawLine(); 
        
        // Player
        my.sprite.bee = this.add.sprite(game.config.width/2, game.config.height - 40, "bee"); // Create bee/ player
        my.sprite.bee.setScale(1);

        // Create fly data
        const flyData = [
            { speed: 7000, startY: game.config.height - 600},
            { speed: 8000, startY: game.config.height - 600},
            { speed: 9000, startY: game.config.height - 600},
            { speed: 10000, startY: game.config.height - 600},
            { speed: 8000, startY: game.config.height - 600},
            { speed: 7000, startY: game.config.height - 600},
            { speed: 7500, startY: game.config.height - 600},
            { speed: 8500, startY: game.config.height - 600},
            { speed: 7000, startY: game.config.height - 600},
            { speed: 8000, startY: game.config.height - 600},
            { speed: 9000, startY: game.config.height - 600},
            { speed: 10000, startY: game.config.height - 600},
            { speed: 8000, startY: game.config.height - 600},
            { speed: 7000, startY: game.config.height - 600},
            { speed: 7500, startY: game.config.height - 600},
            { speed: 8500, startY: game.config.height - 600}
        ];
        // Create flies
        flyData.forEach(config => {
            let fly = this.add.follower(this.curve, Math.random() * game.config.width, config.startY, "fly").setScale(1);
            fly.scorePoints = 10;
            
            fly.startFollow({
                duration: config.speed,
                repeat: 0,
                yoyo: false,
                rotateToPath: false,
                rotationOffset: -90,
                ease: 'Sine.easeInOut',
                onComplete: () => this.flyEnd(fly)
            });
            
            this.my.sprite.flies.push(fly);
        });
        
        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        my.text.lives = this.add.bitmapText(580, 0, "rocketSquare", "Lives  " + this.myLives);
    }

    // Function for drawing fly paths
    drawLine() {
        this.graphics.clear();  
        this.graphics.lineStyle(2, 0xffffff, 1);  
        this.graphics.visible = false;
        this.curve.draw(this.graphics, 32); 
    }

    update() {
        let my = this.my;
        
        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.bee.x > (my.sprite.bee.displayWidth/2)) {
                my.sprite.bee.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.bee.x < (game.config.width - (my.sprite.bee.displayWidth/2))) {
                my.sprite.bee.x += this.playerSpeed;
            }
        }

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.bullet.length < this.maxBullets) {
                this.sound.play("laserS");
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.bee.x, my.sprite.bee.y-(my.sprite.bee.displayHeight/2), "laser")
                );
            }
        }

        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }

        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));
        
        // Bullet collides with fly
        for (let bullet of my.sprite.bullet) {
            for (let fly of my.sprite.flies) {
                if (this.collides(fly, bullet)) {
                    this.flyHit(fly, bullet);
                    break;
                }
            }
        }

        // Player collides with fly
        for (let fly of my.sprite.flies) {
            if (this.collides(my.sprite.bee, fly) && !this.collisionCooldown) {
                this.playerHit(fly);
            }
        }
        // Next round
        if (this.my.sprite.flies.length <= 0 && this.myLives > 0) {
            this.scene.start("intermission");
        }
        // Game over
        if (this.myLives <= 0){
            this.scene.start("gameOver");
        }
    }
    
    // Fly collides with bullet
    flyHit(fly, bullet) {
        this.add.sprite(fly.x, fly.y, "fly_hit").setScale(1).play("damageFly");
        bullet.y = -100;
        fly.destroy();
        this.my.sprite.flies = this.my.sprite.flies.filter(f => f !== fly);
        this.myScore += fly.scorePoints;
        this.updateScore();
        this.sound.play("defeatE", { 
            volume: 1 
        });
    }

    // Player hit
    playerHit(fly) {
        this.add.sprite(this.my.sprite.bee.x, this.my.sprite.bee.y, "bee_hit").setScale(1).play("damageBee");
        fly.destroy();
        this.my.sprite.flies = this.my.sprite.flies.filter(f => f !== fly);

        this.myScore -= 5;
        this.myLives -= 1;
        this.updateScore();
        this.updateLives();
        this.sound.play("hit1", { 
            volume: 1 
        });
        
        this.time.delayedCall(this.cooldownTime, () => {
            this.collisionCooldown = false;
        });
    }

    // Fly reaches end
    flyEnd(fly) {
        if (this.my.sprite.flies.includes(fly)) {
            fly.destroy();
            this.my.sprite.flies = this.my.sprite.flies.filter(f => f !== fly);
            this.myScore -= 5;
            this.myLives -= 1;
            this.updateScore();
            this.updateLives();
            this.sound.play("baseHit", {
                volume: 1
            });
        }
    }
    
    // Collision
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    // Update lives
    updateLives(){
        let my = this.my;
        my.text.lives.setText("Lives " + this.myLives);
    }

    // Update score
    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }

}