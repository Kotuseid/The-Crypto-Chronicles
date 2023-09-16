let NAME_1 = "Elon";
let NAME_2 = "Mark";

//declare variables

let player1, player2,
    backgroundImage, shieldImage,
    border,
    digitalDisco,
    maxCooldown = 150,
    healthBoost, shield,
    spikeDebuff,
    playing = false, playButton,
    music, swordSound, punchSound, metalSound,cutSound,powerupSound;

//preload images, fonts, animations, soundtracks

function preload() {
    backgroundImage = loadImage("assets/background/sky bridge.png");//load background
    shieldImage = loadImage("assets/buffs/Bubble.png");//load shield image
    digitalDisco = loadFont("assets/font/DigitalDisco.ttf");//load font
    soundFormats('mp3');
    music = loadSound('assets/sounds/music.mp3');//load background music
    swordSound = loadSound('assets/sounds/sword.mp3');
    punchSound = loadSound('assets/sounds/punch.mp3');
    metalSound = loadSound('assets/sounds/metal.mp3');
    cutSound = loadSound('assets/sounds/cut.mp3');
    powerupSound = loadSound('assets/sounds/powerup.mp3');
}

//setup sprites, canvas, world physics

function setup() {
    new Canvas("16:9");

    backgroundImage.width = canvas.w;
    backgroundImage.height = canvas.h;

    // --- SOUNDS --- //
    music.playMode = 'restart';
    music.setLoop(true);
    music.setVolume(0.08);
    swordSound.setVolume(0.5);
    punchSound.setVolume(0.5);
    cutSound.setVolume(0.05);
    metalSound.setVolume(0.05);
    powerupSound.setVolume(0.05);


    // --- BORDERS --- //
    border = new Group();
    border.collider = 's';
    border.visible = false;
    //top border
    new border.Sprite(canvas.w / 2, 0, canvas.w, canvas.w * 0.27);
    //bottom border
    new border.Sprite(canvas.w / 2, canvas.h, canvas.w, canvas.w * 0.14);
    //left border
    new border.Sprite(0, canvas.h / 2, 10, canvas.h);
    //right border
    new border.Sprite(canvas.w, canvas.h / 2, 10, canvas.h);

    // --- SPIKES --- //
    spikeDebuff = new Group();
    spikeDebuff.img = "assets/debuffs/Spikes.png";
    spikeDebuff.scale = 0.78;
    spikeDebuff.width = 60;
    spikeDebuff.height = 25;
    spikeDebuff.collider = 's';
    new spikeDebuff.Sprite(canvas.w / 3, canvas.h / 2)
    new spikeDebuff.Sprite(canvas.w / 3 * 2, canvas.h / 3 * 2)



    // --- PLAYER 1 --- //
    player1 = new Sprite(5 + 55 / 2, canvas.h / 2, 55, 75);

    //load spritesheet animations
    player1.addAni("walk", "assets/robot/Walk.png", { frames: 8, frameSize: [128, 128], frameDelay: 5 });
    player1.addAni("idle", "assets/robot/Idle.png", { frames: 5, frameSize: [128, 128], frameDelay: 7 });
    player1.addAni("attack1", "assets/robot/Attack_1.png", { frames: 4, frameSize: [128, 128], frameDelay: 7 });
    player1.addAni("attack2", "assets/robot/Attack_2.png", { frames: 3, frameSize: [128, 128], frameDelay: 7 });
    player1.addAni("dead", "assets/robot/Dead.png", { frames: 7, frameSize: [128, 128], frameDelay: 7 });

    //sprite settings
    player1.anis.dead.looping = false;
    player1.changeAni('idle');
    player1.scale = 1.65;
    player1.anis.offset.y = -25;
    player1.rotationLock = true;

    //custom functions
    player1.attack1 = async () => {
        if (player1.cooldown == 0) {
            player1.cooldown = maxCooldown * 2 / 3;
            swordSound.play();
            if (player1.overlapping(player2) && player2.invincible == false) {
                if (!player1.mirror.x) {
                    if (player1.x < player2.x) {
                        player2.health -= 5;
                        cutSound.play();
                    }
                } else {
                    if (player1.x > player2.x) {
                        player2.health -= 5;
                        cutSound.play();
                    }
                }
                if (player2.health < 0) {
                    player2.health = 0;
                }
            }
                await player1.changeAni('attack1');
            player1.changeAni('idle');
        }
    }
    player1.attack2 = async () => {
        if (player1.cooldown == 0) {
            player1.cooldown = maxCooldown;
            swordSound.play();
            if (player1.overlapping(player2) && player2.invincible == false) {
                if (!player1.mirror.x) {
                    if (player1.x < player2.x) {
                        player2.health -= 10;
                        cutSound.play();
                    }
                } else {
                    if (player1.x > player2.x) {
                        player2.health -= 10;
                        cutSound.play();
                    }
                }
                
                if (player2.health < 0) {
                    player2.health = 0;
                }
            }
            await player1.changeAni('attack2');
            player1.changeAni('idle');
        }
    }

    //custom properties
    player1.keys = { up: "w", down: "s", left: "a", right: "d" };
    player1.agility = 5;
    player1.health = 100;
    player1.cooldown = 0;
    player1.invincible = false;


    // --- PLAYER 2 --- //
    player2 = new Sprite(canvas.w - 5 - 60 / 2, canvas.h / 2, 60, 55);

    //load spritesheet animations
    player2.addAni('idle', "assets/reptile/idle.png", { frames: 4, frameSize: [70, 70], frameDelay: 10 })
    player2.addAni('walk', "assets/reptile/walk.png", { frames: 6, frameSize: [70, 70], frameDelay: 8 })
    player2.addAni('attack1', "assets/reptile/attack1.png", { frames: 5, frameSize: [90, 90], frameDelay: 7 })
    player2.addAni('attack2', "assets/reptile/attack2.png", { frames: 4, frameSize: [90, 70], frameDelay: 7 })
    player2.addAni('dead', "assets/reptile/dead.png", { frames: 4, frameSize: [70, 70], frameDelay: 10 })

    //sprite settings
    player2.anis.dead.looping = false;
    player2.changeAni('idle');
    player2.scale = 2.2;
    player2.mirror.x = true;
    player2.rotationLock = true;

    //custom functions
    player2.attack1 = async () => {
        if (player2.cooldown == 0) {
            player2.cooldown = maxCooldown * 2 / 3;
            punchSound.play();
            if (player2.overlapping(player1) && player1.invincible == false) {
                if (!player2.mirror.x) {
                    if (player2.x < player1.x) {
                        player1.health -= 7;
                        metalSound.play();
                    }
                } else {
                    if (player2.x > player1.x) {
                        player1.health -= 7;
                        metalSound.play();
                    }
                }

                if (player1.health < 0) {
                    player1.health = 0;
                }
            }
            await player2.changeAni('attack1');
            player2.changeAni('idle');
        }
    }
    player2.attack2 = async () => {
        if (player2.cooldown == 0) {
            player2.cooldown = maxCooldown;
            punchSound.play();
            if (player2.overlapping(player1) && player1.invincible == false) {
                if (!player2.mirror.x) {
                    if (player2.x < player1.x) {
                        player1.health -= 13;
                        metalSound.play();
                    }
                } else {
                    if (player2.x > player1.x) {
                        player1.health -= 13;
                        metalSound.play();
                    }
                }
                if (player1.health < 0) {
                    player1.health = 0;
                }
            }
            await player2.changeAni('attack2');
            player2.changeAni('idle');
        }
    }

    //custom properties
    player2.keys = { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight" };
    player2.agility = 4;
    player2.health = 100;
    player2.cooldown = 0;
    player2.invincible = false;

    player1.overlaps(player2);

    // --- HEALTH BOOST --- //
    healthBoost = new Group();
    healthBoost.img = "assets/buffs/Life.png";
    healthBoost.x = () => { return random(5, canvas.w - 5) };
    healthBoost.y = () => { return random(canvas.w * 0.135, canvas.h - canvas.w * 0.07) };
    healthBoost.d = 140;
    healthBoost.scale = 0.4;
    healthBoost.frequency = 30;//seconds

    setTimeout(() => {
        if (healthBoost.length == 0) {
            new healthBoost.Sprite();
        }
    }, healthBoost.frequency * 1000);

    player1.overlaps(healthBoost, boostHealth);
    player2.overlaps(healthBoost, boostHealth);

    // --- SHIELD --- //
    shield = new Group();
    shield.img = "assets/buffs/Bubble.png";
    shield.x = () => { return random(5, canvas.w - 5) };
    shield.y = () => { return random(canvas.w * 0.135, canvas.h - canvas.w * 0.07) };
    shield.d = 140;
    shield.scale = 0.5;
    shield.frequency = 30;//seconds

    setTimeout(() => {
        if (shield.length == 0) {
            new shield.Sprite();
        }
    }, shield.frequency * 1000 / 2);

    player1.overlaps(shield, boostShield);
    player2.overlaps(shield, boostShield);



    // --- SPIKES --- //
    player1.overlapping(spikeDebuff, spikeDamage);
    player2.overlapping(spikeDebuff, spikeDamage);


    allSprites.autoDraw = false;

    textAlign(CENTER, CENTER);
    textFont(digitalDisco);

    playButton = new Sprite(canvas.w / 2, canvas.h / 2, 200, 70, 's');
    playButton.visible = false;
    playButton.color = color(0, 0, 0, 255);

    //background image
    image(backgroundImage, 0, 0);
    playButton.draw();

    
}


document.addEventListener("click", () => {
    if (!music.isPlaying()) {
        music.play();
    }

})














//draw loop
function draw() {

    // --- IF PLAYING --- //
    if (playing) {
        //background image
        image(backgroundImage, 0, 0);


        // --- STATS DISPLAY --- //
        statsDisplay(30, 30, 200, 30, player1, NAME_1);
        statsDisplay(canvas.w - 200 - 30, 30, 200, 30, player2, NAME_2);

        allSprites.draw();

        // --- IF NOT DEAD --- //
        if (player1.health > 0 && player2.health > 0) {

            // --- PLAYER ATTACKS --- //
            if (kb.pressed('v')) {
                player1.attack1();
            } else if (kb.pressed('b')) {
                player1.attack2();
            }
            if (kb.pressed('.')) {
                player2.attack1();
            } else if (kb.pressed(',')) {
                player2.attack2();
            }

            // --- PLAYER MOVEMENT --- //
            movement(player1);
            movement(player2);

        }
        // --- PLAYER 1 IS DEAD --- //
        else if (player1.health <= 0) {
            player1.changeAni('dead');
            player1.collider = 's';
            player2.collider = 's';

            //Player 2 win screen
            textSize(100);
            stroke(255);
            strokeWeight(5);
            fill("black");
            text(NAME_2 + " wins!", canvas.w / 2, canvas.h - 100);

            playScreen();
        }
        // --- PLAYER 2 IS DEAD --- //
        else if (player2.health <= 0) {
            player2.changeAni('dead');
            player2.collider = 's';
            player1.collider = 's';

            //Player 1 win screen
            textSize(100);
            stroke(255);
            strokeWeight(5);
            fill("black");
            text(NAME_1 + " wins!", canvas.w / 2, canvas.h - 100);

            playScreen();
        }

        if (player1.invincible) {

            image(shieldImage, player1.x - 75, player1.y - 75, 150, 150);
        }
        if (player2.invincible) {

            image(shieldImage, player2.x - 75, player2.y - 75, 150, 150);
        }



        //decrement the cooldown
        if (player1.cooldown > 0) player1.cooldown--;
        if (player2.cooldown > 0) player2.cooldown--;

    } else {
        playScreen();
    }
}
