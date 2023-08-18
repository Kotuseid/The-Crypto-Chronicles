
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

function boostHealth(p, h) {

    p.health += 5;
    if (p.health > 100) {
        p.health = 100;
    }
    h.remove();
    setTimeout(() => {
        if (healthBoost.length == 0) {
            new healthBoost.Sprite();
        }
    }, healthBoost.frequency * 1000);
}