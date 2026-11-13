// The four pictures as a lookup table: pacArray[direction][mouth]
//   direction 0 = facing right, 1 = facing left
//   mouth     0 = open,         1 = closed
const pacArray = [
    ['./images/pacman1.png', './images/pacman2.png'],
    ['./images/pacman3.png', './images/pacman4.png']
];
const SIZE = 100; // every Pac-Man is drawn 100 × 100 pixels (see .pac in style.css)

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
    newimg.className = 'pac';
    newimg.alt = '';
    newimg.src = pacArray[0][0];
    newimg.style.left = position.x + 'px';
    newimg.style.top = position.y + 'px';
    game.appendChild(newimg);

    return {
        position,
        velocity,
        newimg,
        direction: 0, // facing right
        mouth: 0      // open
    }
}

// Show the picture that matches this Pac-Man's direction and mouth.
function setPicture(item) {
    item.newimg.src = pacArray[item.direction][item.mouth];
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
        item.mouth = 1 - item.mouth; // 0 → 1 → 0 → 1 …
        setPicture(item);
    });

    setTimeout(update_mouth, 200);
}

function checkCollisions(item) {
    let width = SIZE;
    let height = SIZE;

    if (item.position.x + width >= window.innerWidth) {
        item.velocity.x = -item.velocity.x;
        item.direction = 1; // now facing left
        setPicture(item);
    } else if (item.position.x <= 0) {
        item.velocity.x = item.velocity.x * -1;
        item.direction = 0; // now facing right
        setPicture(item);
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
