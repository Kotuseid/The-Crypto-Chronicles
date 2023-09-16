
//custom player stats display function
function statsDisplay(x, y, w, h, sprite, name) {

    let p = 5;

    textAlign(CENTER, CENTER);
    textFont(digitalDisco);
    textSize(p * 4);

    //display name
    fill('black');
    strokeWeight(1);
    stroke(255);
    text(name + ': ' + sprite.health + '%', x + w / 2, y - 3 * p);

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

    //animate sprite walking or idle or not attacking or dead
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

//when player collects health boost
function boostHealth(p, h) {

    p.health += 5;
    if (p.health > 100) {
        p.health = 100;
    }
    h.remove();
    powerupSound.play();
    
    setTimeout(() => {
        if (healthBoost.length == 0) {
            new healthBoost.Sprite();
        }
    }, healthBoost.frequency * 1000);
}

//when player collects shield boost
function boostShield(p, s) {

    p.invincible = true;
    setTimeout(() => {
        p.invincible = false;
    }, 5000);
    s.remove();
    powerupSound.play();

    setTimeout(() => {
        if (shield.length == 0) {
            new shield.Sprite();
        }
    }, shield.frequency * 1000);
}

//when player touches spikes
function spikeDamage(p, s) {
    if (!p.invincible && frameCount % 60 == 0) {
        p.health -= 1;
        if (p.keys.up == "w") {
            metalSound.play();
        } else {
            cutSound.play();
        }
    }
}

//function to save names when button is pressed
let saveNames = () => {
    NAME_1 = document.getElementById('name1').value;
    NAME_2 = document.getElementById('name2').value;
}

//prevent the window from moving when pressing arrow keys
window.addEventListener("keydown", function (e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);


function playScreen() {
    playButton.y = canvas.h / 2;
    playButton.visible = false;


    stroke(255, 0, 0);
    strokeWeight(5);
    fill(0);
    rect(canvas.w / 2 - 100, canvas.h / 2 - 35, 200, 70);
    noStroke();
    fill(255);
    textSize(80);
    text("PLAY", canvas.w / 2, canvas.h / 2 - 5);



    if (playButton.mouse.hovering()) {
        mouse.cursor = 'pointer';
    } else {
        mouse.cursor = 'default';
    }

    if (playButton.mouse.pressing()) {
        playing = true;

        player1.collider = 'd';
        player2.collider = 'd';
        player1.x = 5 + 55 / 2;
        player1.y = canvas.h / 2;
        player2.x = canvas.w - 5 - 60 / 2;
        player2.y = canvas.h / 2;
        

        player1.agility = 5;
        player1.health = 100;
        player1.cooldown = 0;
        player1.invincible = false;
        player1.mirror.x = false;
        player1.changeAni('idle');


        player2.agility = 4;
        player2.health = 100;
        player2.cooldown = 0;
        player2.invincible = false;
        player2.mirror.x = true;
        player2.changeAni('idle');

        healthBoost.amount = 0;
        shield.amount = 0;


        playButton.y = 2 * canvas.h;
        mouse.cursor = 'default';
    }
}