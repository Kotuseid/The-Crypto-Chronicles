const NAME_1 = "Elon";
const NAME_2 = "Mark";

//declare variables

let player1, player2,
    backgroundImage,
    border,
    digitalDisco,
    maxCooldown = 150,
    healthBoost;

//preload images, fonts, animations, soundtracks

function preload() {
    backgroundImage = loadImage("assets/background/sky bridge.png");//load background
    digitalDisco = loadFont("assets/font/DigitalDisco.ttf");//load font
}

//setup sprites, canvas, world physics

function setup() {
    new Canvas("16:9");

    backgroundImage.width = canvas.w;
    backgroundImage.height = canvas.h;

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

    // --- PLAYER 1 --- //
    player1 = new Sprite(canvas.w / 4, canvas.h / 2, 55, 75);

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

            await player1.changeAni('attack1');
            if (player1.overlapping(player2)) {
                if (!player1.mirror.x) {
                    if (player1.x < player2.x) {
                        player2.health -= 5;
                    }
                } else {
                    if (player1.x > player2.x) {
                        player2.health -= 5;
                    }
                }
                if (player2.health < 0) {
                    player2.health = 0;
                }
            }
            player1.changeAni('idle');
        }
    }
    player1.attack2 = async () => {
        if (player1.cooldown == 0) {
            player1.cooldown = maxCooldown;

            await player1.changeAni('attack2');
            if (player1.overlapping(player2)) {
                if (!player1.mirror.x) {
                    if (player1.x < player2.x) {
                        player2.health -= 10;
                    }
                } else {
                    if (player1.x > player2.x) {
                        player2.health -= 10;
                    }
                }

                if (player2.health < 0) {
                    player2.health = 0;
                }
            }
            player1.changeAni('idle');
        }
    }

    //custom properties
    player1.keys = { up: "w", down: "s", left: "a", right: "d" };
    player1.agility = 4;
    player1.health = 100;
    player1.cooldown = 0;

    // --- PLAYER 2 --- //
    player2 = new Sprite(canvas.w / 4 * 3, canvas.h / 2, 60, 55);

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

            await player2.changeAni('attack1');
            if (player2.overlapping(player1)) {
                if (!player2.mirror.x) {
                    if (player2.x < player1.x) {
                        player1.health -= 7;
                    }
                } else {
                    if (player2.x > player1.x) {
                        player1.health -= 7;
                    }
                }

                if (player1.health < 0) {
                    player1.health = 0;
                }
            }
            player2.changeAni('idle');
        }
    }
    player2.attack2 = async () => {
        if (player2.cooldown == 0) {
            player2.cooldown = maxCooldown;

            await player2.changeAni('attack2');
            if (player2.overlapping(player1)) {
                if (!player2.mirror.x) {
                    if (player2.x < player1.x) {
                        player1.health -= 13;
                    }
                } else {
                    if (player2.x > player1.x) {
                        player1.health -= 13;
                    }
                }
                if (player1.health < 0) {
                    player1.health = 0;
                }
            }
            player2.changeAni('idle');
        }
    }

    //custom properties
    player2.keys = { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight" };
    player2.agility = 3;
    player2.health = 100;
    player2.cooldown = 0;

    player1.overlaps(player2);


    healthBoost = new Group();
    healthBoost.img = "assets/buffs/Life.png";
    healthBoost.x = () => { return random(5, canvas.w - 5) };
    healthBoost.y = () => { return random(canvas.w * 0.135, canvas.h - canvas.w * 0.07) };
    healthBoost.d = 140;
    healthBoost.scale = 0.4;
    healthBoost.frequency = 5;//seconds

    setInterval(() => {
        if (healthBoost.length == 0) {
            new healthBoost.Sprite();
        }
    }, healthBoost.frequency * 1000);

    player1.overlaps(healthBoost, boostHealth);

    player2.overlaps(healthBoost, boostHealth);

    //only for testing
    allSprites.debug = true;
}

//draw loop
function draw() {
    //background image
    image(backgroundImage, 0, 0);

    // --- IF NOT DEAD --- //
    if (player1.health > 0 && player2.health > 0) {

        // --- PLAYER ATTACKS --- //
        if (kb.pressed('e')) {
            player1.attack1();
        } else if (kb.pressed('q')) {
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
    }
    // --- PLAYER 2 IS DEAD --- //
    else if (player2.health <= 0) {
        player2.changeAni('dead');
        player2.collider = 's';
        player1.collider = 's';
    }

    // --- STATS DISPLAY --- //
    statsDisplay(30, 30, 200, 30, player1, NAME_1);
    statsDisplay(canvas.w - 200 - 30, 30, 200, 30, player2, NAME_2);

    //decrement the cooldown
    if (player1.cooldown > 0) player1.cooldown--;
    if (player2.cooldown > 0) player2.cooldown--;
}
