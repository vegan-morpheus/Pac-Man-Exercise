const pacMen = [];
let started = false;

function setToRandom(scale) {
    return {
        x: Math.random() * scale,
        y: Math.random() * scale
    }
}

function makePac() {
    let velocity = setToRandom(10);
    let position = setToRandom(200);

    let game = document.getElementById('game');
    let newimg = document.createElement('img');
    newimg.style.position = 'absolute';
    newimg.src = './images/pacman1.png';
    newimg.width = 100;
    newimg.style.left = position.x + 'px';
    newimg.style.top = position.y + 'px';
    game.appendChild(newimg);

    return {
        position,
        velocity,
        newimg
    }
}

function update() {
    pacMen.forEach((item) => {
        checkCollisions(item)
        item.position.x += item.velocity.x;
        item.position.y += item.velocity.y;

        item.newimg.style.left = item.position.x + 'px';
        item.newimg.style.top = item.position.y + 'px';
    })
    setTimeout(update, 20);
}

function update_mouth() {
    pacMen.forEach((item) => {
        if (item.newimg.src.indexOf("pacman1.png") != -1) {
            item.newimg.src = "./images/pacman2.png";
        } else if (item.newimg.src.indexOf("pacman2.png") != -1) {
            item.newimg.src = "./images/pacman1.png";
        } else if (item.newimg.src.indexOf("pacman3.png") != -1) {
            item.newimg.src = "./images/pacman4.png";
        } else if (item.newimg.src.indexOf("pacman4.png") != -1) {
            item.newimg.src = "./images/pacman3.png";
        }
    });

    setTimeout(update_mouth, 200);
}

function checkCollisions(item) {
    let width = item.newimg.width;
    let height = item.newimg.height;

    if (item.position.x + width >= window.innerWidth) {
        if (item.newimg.src.indexOf("pacman1.png") != -1) {
            item.newimg.src = "./images/pacman4.png";
        }
        if (item.newimg.src.indexOf("pacman2.png") != -1) {
            item.newimg.src = "./images/pacman3.png";
        }
        item.velocity.x = -item.velocity.x;
    } else if (item.position.x <= 0) {
        if (item.newimg.src.indexOf("pacman3.png") != -1) {
            item.newimg.src = "./images/pacman2.png";
        }
        if (item.newimg.src.indexOf("pacman4.png") != -1) {
            item.newimg.src = "./images/pacman1.png";
        }
        item.velocity.x = item.velocity.x * -1;
    }

    if (item.position.y + height >= window.innerHeight) {
        item.velocity.y = -item.velocity.y;
    } else if (item.position.y <= 0) {
        item.velocity.y = item.velocity.y * -1;
    }
}

function makeOne() {
    pacMen.push(makePac()); // add a new PacMan
}

function startGame() {
    if (started) return; // already running, so don't start a second loop
    started = true;
    update();
    update_mouth();
}

// The buttons find their functions here, instead of in onclick='…' in the HTML.
document.getElementById('add').addEventListener('click', makeOne);
document.getElementById('start').addEventListener('click', startGame);
