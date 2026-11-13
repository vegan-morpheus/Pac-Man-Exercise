// The four pictures as a lookup table: pacArray[direction][mouth]
//   direction 0 = facing right, 1 = facing left
//   mouth     0 = open,         1 = closed
const pacArray = [
    ['./images/pacman1.png', './images/pacman2.png'],
    ['./images/pacman3.png', './images/pacman4.png']
];
const SIZE = 100; // every Pac-Man is drawn 100 × 100 pixels (see .pac in style.css)

const game = document.getElementById('game');
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
    let position = {
        // anywhere inside the game box (minus one Pac-Man, so it fits)
        x: Math.random() * (game.clientWidth - SIZE),
        y: Math.random() * (game.clientHeight - SIZE)
    };

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
    // The walls are now the edges of the game box, not the browser window.
    let width = game.clientWidth;
    let height = game.clientHeight;

    // Math.abs(n) is n without its minus sign. Setting the direction like
    // this, instead of flipping it with -velocity, means a Pac-Man that ends
    // up outside the box (say, after the window shrinks) always heads back
    // in, instead of flipping every frame and getting stuck.
    if (item.position.x + SIZE >= width) {
        item.velocity.x = -Math.abs(item.velocity.x); // go left
    } else if (item.position.x <= 0) {
        item.velocity.x = Math.abs(item.velocity.x);  // go right
    }

    if (item.position.y + SIZE >= height) {
        item.velocity.y = -Math.abs(item.velocity.y); // go up
    } else if (item.position.y <= 0) {
        item.velocity.y = Math.abs(item.velocity.y);  // go down
    }

    // Face the way it's moving. (condition ? a : b gives a if the condition
    // is true, otherwise b.)
    let direction = item.velocity.x >= 0 ? 0 : 1;
    if (direction !== item.direction) {
        item.direction = direction;
        setPicture(item);
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
