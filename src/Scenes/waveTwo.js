class WaveTwo extends Phaser.Scene {
    constructor() {
        super("waveTwo");
        this.my = {sprite: {}, text: {}};
        this.initGame();
    }

    initGame() {
        this.my.sprite.bullet = [];
        this.my.sprite.flies = [];
        this.my.sprite.spiders = []; 
        this.my.sprite.spiderProjectiles = [];
        this.playerSpeed = 15;
        this.bulletSpeed = 25;
        this.spiderProjSpeed = 30;
        this.spiderDelay = 2000;
        this.lastSpiderShot = 0;
        this.maxBullets = 5; 
        this.myLives = 3;
        this.collisionCooldown = false;
        this.cooldownTime = 500;
        this.myScore = 0;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("bee", "bee_fly.png");
        this.load.image("laser", "laserRed04.png");
        this.load.image("fly", "fly_fly.png");
        this.load.image("bee_hit", "bee_hit.png");
        this.load.image("fly_hit", "fly_hit.png");
        this.load.image("spider", "spider.png");
        this.load.image("spider_hit", "spider_hit.png");
        this.load.image("spider_proj", "laserBlue04.png");
        this.load.image("spider_proj2", "laserBlue08.png");

        this.load.audio("laserS", "laserSmall_003.ogg");
        this.load.audio("defeatE", "explosionCrunch_002.ogg");
        this.load.audio("playerHurt", "explosionCrunch_000.ogg");
        this.load.audio("hit1", "scratch_005.ogg");
        this.load.audio("baseHit", "doorOpen_002.ogg");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        this.initGame();
        let my = this.my;

        my.text.score = this.add.bitmapText(20, 0, "rocketSquare", "Score " + this.myScore);

        this.anims.create({ // Player getting hit
            key: "damageBee",
            frames: [
                { key: "bee_hit" },
            ],
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });

        this.anims.create({ // Fly getting hit
            key: "damageFly",
            frames: [
                { key: "fly_hit" },
            ],
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });

        this.anims.create({ // Spider getting hit
            key: "damageSpider",
            frames: [
                { key: "spider_hit" },
            ],
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });

        this.anims.create({ // Spider projectile
            key: "spiderProject",
            frames: [
                { key: "spider_proj" },
                { key: "spider_proj2"},
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
            { speed: 8500, startY: game.config.height - 600}
        ];

        // Create spider data
        const spiderData = [
            { speed: 10000, startY: game.config.height - 600 },
            { speed: 11000, startY: game.config.height - 600 },
            { speed: 13000, startY: game.config.height - 600 },
            { speed: 10000, startY: game.config.height - 600 },
            { speed: 12000, startY: game.config.height - 600 },
            { speed: 12000, startY: game.config.height - 600 },
            { speed: 10000, startY: game.config.height - 600 },
            { speed: 11000, startY: game.config.height - 600 },
            { speed: 13000, startY: game.config.height - 600 },
            { speed: 10000, startY: game.config.height - 600 },
            { speed: 12000, startY: game.config.height - 600 },
            { speed: 12000, startY: game.config.height - 600 }
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

        // Create spiders
        spiderData.forEach(config => {
            let spider = this.add.follower(this.curve, Math.random() * game.config.width, config.startY, "spider").setScale(1);
            spider.scorePoints = 20; 
            
            spider.startFollow({
                duration: config.speed,
                repeat: 0,
                yoyo: false,
                rotateToPath: false,
                rotationOffset: -90,
                ease: 'Sine.easeInOut',
                onComplete: () => this.spiderEnd(spider)
            });
            
            this.my.sprite.spiders.push(spider); 
        });

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        my.text.lives = this.add.bitmapText(580, 0, "rocketSquare", "Lives " + this.myLives);
    }

    // Function for drawing paths
    drawLine() {
        this.graphics.clear();  
        this.graphics.lineStyle(2, 0xffffff, 1);  
        this.graphics.visible = false;
        this.curve.draw(this.graphics, 32); 
    }

    // Time is added for the spider projectiles
    update(time) {
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
            
            // Bullet collides with spider
            for (let spider of my.sprite.spiders) {
                if (this.collides(spider, bullet)) {
                    this.spiderHit(spider, bullet);
                    break;
                }
            }
        }

        // Spider projectiles
        if (time > this.lastSpiderShot + this.spiderDelay) {
            this.lastSpiderShot = time;
            
            // Have each spider shoot with a certain probability so it is randomized
            for (let spider of my.sprite.spiders) {
                if (Math.random() < .6) { // 60% chance of the spider shooting
                    this.spiderShoot(spider);
                }
            }
        }
        // Spider projectile speed
        for (let bullet of my.sprite.spiderProjectiles) {
            bullet.y += this.spiderProjSpeed;
        }


        my.sprite.spiderProjectiles = my.sprite.spiderProjectiles.filter(
            bullet => bullet.y < game.config.height + bullet.displayHeight
        );
        
        // Check collision between spider bullets and player
        for (let bullet of my.sprite.spiderProjectiles) {
            if (this.collides(my.sprite.bee, bullet) && !this.collisionCooldown) {
                this.playerProjHit(bullet);
                break; 
            }
        }
        // Player collides with fly
        for (let fly of my.sprite.flies) {
            if (this.collides(my.sprite.bee, fly) && !this.collisionCooldown) {
                this.playerHit(fly);
            }
        }
        // Player collides with spider
        for (let spider of my.sprite.spiders) {
            if (this.collides(my.sprite.bee, spider) && !this.collisionCooldown) {
                this.playerHit(spider);
            }
        }
        
        if (this.my.sprite.flies.length <= 0 && this.my.sprite.spiders.length <= 0 && this.myLives > 0) {
            this.scene.start("intermission2");
        }
        // Game over
        if (this.myLives <= 0) {
            this.scene.start("gameOver2");
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
    // Spider collides with bullet
    spiderHit(spider, bullet) {
        this.add.sprite(spider.x, spider.y, "fly_hit").setScale(1).play("damageSpider");
        bullet.y = -100;
        spider.destroy();
        this.my.sprite.spiders = this.my.sprite.spiders.filter(s => s !== spider);
        this.myScore += spider.scorePoints;
        this.updateScore();
        this.sound.play("defeatE", { 
            volume: 1 
        });
    }

    // Player collides with enemy
    playerHit(enemy) {
        this.collisionCooldown = true;
    
        this.add.sprite(this.my.sprite.bee.x, this.my.sprite.bee.y, "bee_hit").setScale(1).play("damageBee");
 
        if (enemy.texture.key === "fly"){
            this.myScore -= 5;
            this.myLives -= 1;
            this.my.sprite.flies = this.my.sprite.flies.filter(f => f !== enemy);
        }
        else if (enemy.texture.key === "spider") {
            this.myScore -= 10;
            this.myLives -= 2;
            this.my.sprite.spiders = this.my.sprite.spiders.filter(s => s !== enemy);
        }
 
        enemy.destroy();
        this.updateScore();
        this.updateLives();
        this.sound.play("hit1", { 
                volume: 1 
            });
     
        this.time.delayedCall(this.cooldownTime, () => {
            this.collisionCooldown = false;
        });
    }

    // Player collides with projectile
    playerProjHit(bullet){
        this.collisionCooldown = true;
        this.add.sprite(this.my.sprite.bee.x, this.my.sprite.bee.y, "bee_hit").setScale(1).play("damageBee");

        this.add.sprite(this.my.sprite.bee.x, this.my.sprite.bee.y, "spider_proj2").setScale(1).play("spiderProject");
        
        bullet.destroy();
        this.my.sprite.spiderProjectiles = this.my.sprite.spiderProjectiles.filter(b => b !== bullet);
        
        this.myScore -= 5;
        this.myLives -= 1;
        this.updateScore();
        this.updateLives();
        this.sound.play("playerHurt", { 
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

    // Spider reaches end
    spiderEnd(spider) {
        if (this.my.sprite.spiders.includes(spider)) {
            spider.destroy();
            this.my.sprite.spiders = this.my.sprite.spiders.filter(s => s !== spider);
            this.myScore -= 10;
            this.myLives -= 2;
            this.updateScore();
            this.updateLives();
            this.sound.play("baseHit", {
                volume: 1
            });
        }
    }

    // Creating spider profectiles
    spiderShoot(spider){
        let projectile = this.add.sprite(spider.x, spider.y + spider.displayHeight/2, "spider_proj");
        projectile.setScale(1);
        this.my.sprite.spiderProjectiles.push(projectile);
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    // Update the lives
    updateLives() {
        this.my.text.lives.setText("Lives " + this.myLives);
    }

    // Update the score
    updateScore() {
        this.my.text.score.setText("Score " + this.myScore);
    }
}