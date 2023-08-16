//i am making a change
const NAME_1 = "muja";
const NAME_2 = "ice";

//declare variables

let player1, player2,
    backgroundImage,
    border,
    digitalDisco,
    maxCooldown = 150;

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
    player1 = new Sprite(canvas.w / 4, canvas.h / 2, 30, 75);

    //load spritesheet animations
    player1.addAni("walk", "assets/robot/Walk.png", { frames: 8, frameSize: [128, 128], frameDelay: 5 });
    player1.addAni("idle", "assets/robot/Idle.png", { frames: 5, frameSize: [128, 128], frameDelay: 7 });
    player1.addAni("attack1", "assets/robot/Attack_1.png", { frames: 4, frameSize: [128, 128], frameDelay: 7 });
    player1.addAni("attack2", "assets/robot/Attack_2.png", { frames: 3, frameSize: [128, 128], frameDelay: 7 });
    player1.addAni("dead", "assets/robot/Dead.png", { frames: 7, frameSize: [128, 128], frameDelay: 7 });

    //sprite settings
    player1.anis.dead.looping = false;
    player1.changeAni('idle');
    player1.anis.offset.y = -25;
    player1.rotationLock = true;

    //custom functions
    player1.attack1 = async () => {
        if (player1.cooldown == 0) {
            player1.cooldown = maxCooldown * 2 / 3;

            await player1.changeAni('attack1');
            if (player1.colliding(player2)) {
                if (!player1.mirror.x) {
                    if (player1.x + player1.w / 2 < player2.x - player2.w / 2) {
                        player2.health -= 5;
                    }
                } else {
                    if (player1.x - player1.w / 2 > player2.x + player2.w / 2) {
                        player2.health -= 5;
                    }
                }
            }
            player1.changeAni('idle');
        }
    }
    player1.attack2 = async () => {
        if (player1.cooldown == 0) {
            player1.cooldown = maxCooldown;

            await player1.changeAni('attack2');
            if (player1.colliding(player2)) {
                if (!player1.mirror.x) {
                    if (player1.x + player1.w / 2 < player2.x - player2.w / 2) {
                        player2.health -= 10;
                    }
                } else {
                    if (player1.x - player1.w / 2 > player2.x + player2.w / 2) {
                        player2.health -= 10;
                    }
                }
            }
            player1.changeAni('idle');
        }
    }

    //custom properties
    player1.keys = { up: "w", down: "s", left: "a", right: "d" };
    player1.agility = 3;
    player1.health = 100;
    player1.cooldown = 0;

    // --- PLAYER 2 --- //
    player2 = new Sprite(canvas.w / 4 * 3, canvas.h / 2, 35, 55);

    //load spritesheet animations
    player2.addAni('idle', "assets/reptile/idle.png", { frames: 4, frameSize: [70, 70], frameDelay: 10 })
    player2.addAni('walk', "assets/reptile/walk.png", { frames: 6, frameSize: [70, 70], frameDelay: 8 })
    player2.addAni('attack1', "assets/reptile/attack1.png", { frames: 5, frameSize: [90, 90], frameDelay: 7 })
    player2.addAni('attack2', "assets/reptile/attack2.png", { frames: 4, frameSize: [90, 70], frameDelay: 7 })
    player2.addAni('dead', "assets/reptile/dead.png", { frames: 4, frameSize: [70, 70], frameDelay: 10 })

    //sprite settings
    player2.anis.dead.looping = false;
    player2.changeAni('idle');
    player2.scale = 1.3;
    player2.mirror.x = true;
    player2.rotationLock = true;

    //custom functions
    player2.attack1 = async () => {
        if (player2.cooldown == 0) {
            player2.cooldown = maxCooldown * 2 / 3;

            await player2.changeAni('attack1');
            if (player2.colliding(player1)) {
                if (!player2.mirror.x) {
                    if (player2.x + player2.w / 2 < player1.x - player1.w / 2) {
                        player1.health -= 7;
                    }
                } else {
                    if (player2.x - player2.w / 2 > player1.x + player1.w / 2) {
                        player1.health -= 7;
                    }
                }
            }
            player2.changeAni('idle');
        }
    }
    player2.attack2 = async () => {
        if (player2.cooldown == 0) {
            player2.cooldown = maxCooldown;

            await player2.changeAni('attack2');
            if (player2.colliding(player1)) {
                if (!player2.mirror.x) {
                    if (player2.x + player2.w / 2 < player1.x - player1.w / 2) {
                        player1.health -= 13;
                    }
                } else {
                    if (player2.x - player2.w / 2 > player1.x + player1.w / 2) {
                        player1.health -= 13;
                    }
                }
            }
            player2.changeAni('idle');
        }
    }

    //custom properties
    player2.keys = { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight" };
    player2.agility = 2;
    player2.health = 100;
    player2.cooldown = 0;


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

//custom player stats display function
function statsDisplay(x, y, w, h, sprite, name) {

    let p = 5;

    textAlign(CENTER, CENTER);
    textFont(digitalDisco);
    textSize(p * 4);

    //display name
    fill('black')
    text(name.toUpperCase() + ': ' + sprite.health + '%', x + w / 2, y - 3 * p);

    //display health bar
    noStroke();
    fill('black');
    rect(x, y, w, h);
    fill('red');
    rect(x + p, y + p, (w - p * 2) * sprite.health / 100, h - 2 * p);
    fill('white');
    text("HEALTH", x + w / 2, y + h / 2);

    //display cooldown bar
    fill('black');
    rect(x, y + h + p, w, h);
    fill('green');
    rect(x + p, y + h + 2 * p, (w - 2 * p) * (maxCooldown - sprite.cooldown) / maxCooldown, h - 2 * p);
    fill('white');
    text("COOLDOWN", x + w / 2, y + h / 2 + h + p);

}

//custom movement function
function movement(sprite) {
    let key = sprite.keys;

    //move sprite horizontally
    if (kb.pressing(key.right)) {
        sprite.velocity.x = sprite.agility;

    } else if (kb.pressing(key.left)) {
        sprite.velocity.x = -sprite.agility;

    } else {
        sprite.velocity.x = 0;
    }

    //move sprite vertically
    if (kb.pressing(key.up)) {
        sprite.velocity.y = -sprite.agility;

    } else if (kb.pressing(key.down)) {
        sprite.velocity.y = sprite.agility;

    } else {
        sprite.velocity.y = 0;
    }

    //animate sprite walking or idle of not attacking or dead
    if (sprite.ani.name != 'attack1' && sprite.ani.name != 'attack2' && sprite.ani.name != 'dead') {

        if (kb.pressing(key.right)) {
            sprite.changeAni('walk')
            sprite.mirror.x = false;
        } else if (kb.pressing(key.left)) {
            sprite.changeAni('walk');
            sprite.mirror.x = true;
        }

        if (kb.pressing(key.up) || kb.pressing(key.down)) {
            sprite.changeAni('walk');
        }

        if (!kb.pressing(key.right) && !kb.pressing(key.left) && !kb.pressing(key.up) && !kb.pressing(key.down)) {
            sprite.changeAni('idle');
        }
    }
}