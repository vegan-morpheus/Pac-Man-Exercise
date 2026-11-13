// Pac-Man Exercise, version 2

// The four pictures as a lookup table: pacArray[direction][mouth]
//   direction 0 = facing right, 1 = facing left
//   mouth     0 = open,         1 = closed
const pacArray = [
    ['./images/pacman1.png', './images/pacman2.png'],
    ['./images/pacman3.png', './images/pacman4.png']
];
const SIZE = 100;        // every Pac-Man is drawn 100 × 100 pixels (see .pac in style.css)
const MIN_SPEED = 100;   // pixels per second
const MAX_SPEED = 400;   // pixels per second
const CHOMP_EVERY = 0.2; // seconds between mouth swaps

const game = document.getElementById('game');
const startButton = document.getElementById('start');
const pacMen = [];

let running = false; // true while playing, false while paused
let lastTime = null; // when the previous frame happened, in milliseconds
let chompTimer = 0;  // seconds since the last mouth swap

// A random number from min up to max.
function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

// A random speed in pixels per second. Half the time it's negative, so
// Pac-Men set off left or up as often as right or down.
function randomSpeed() {
    const speed = randomBetween(MIN_SPEED, MAX_SPEED);
    return Math.random() < 0.5 ? speed : -speed;
}

function makePac(x, y) {
    const velocity = { x: randomSpeed(), y: randomSpeed() };
    const position = { x, y };

    const newimg = document.createElement('img');
    newimg.className = 'pac';
    newimg.alt = '';
    game.appendChild(newimg);

    const pac = {
        position,
        velocity,
        newimg,
        direction: velocity.x >= 0 ? 0 : 1, // face the way it's moving
        mouth: 0                            // open
    };
    setPicture(pac);
    draw(pac);
    return pac;
}

// Add a Pac-Man at (x, y) inside the game box, or somewhere random if no
// position is given.
function makeOne(x, y) {
    const maxX = game.clientWidth - SIZE;
    const maxY = game.clientHeight - SIZE;
    if (x === undefined) {
        x = randomBetween(0, maxX);
        y = randomBetween(0, maxY);
    }
    // Math.max and Math.min keep it fully inside the box ("clamping").
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    pacMen.push(makePac(x, y));
}

// Show the picture that matches this Pac-Man's direction and mouth.
function setPicture(pac) {
    pac.newimg.src = pacArray[pac.direction][pac.mouth];
}

// Put the picture where the numbers say it is.
function draw(pac) {
    pac.newimg.style.left = pac.position.x + 'px';
    pac.newimg.style.top = pac.position.y + 'px';
}

// The game loop. The browser calls it once per screen refresh (often 60
// times a second, but 120 on some phones) and passes in the current time.
function loop(time) {
    if (lastTime === null) lastTime = time;
    // Seconds since the last frame. Capped at 0.1 so that coming back to a
    // tab that sat in the background doesn't make everyone jump.
    const dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;

    if (running) update(dt);
    requestAnimationFrame(loop); // book the next frame
}

// Move everyone forward by dt seconds.
function update(dt) {
    pacMen.forEach((pac) => {
        checkCollisions(pac);
        // distance = speed × time, so the speed is the same on any screen
        pac.position.x += pac.velocity.x * dt;
        pac.position.y += pac.velocity.y * dt;
        draw(pac);
    });

    // The mouths run on the same clock: swap every CHOMP_EVERY seconds.
    chompTimer += dt;
    if (chompTimer >= CHOMP_EVERY) {
        chompTimer -= CHOMP_EVERY;
        updateMouth();
    }
}

function updateMouth() {
    pacMen.forEach((pac) => {
        pac.mouth = 1 - pac.mouth; // 0 → 1 → 0 → 1 …
        setPicture(pac);
    });
}

function checkCollisions(pac) {
    // The walls are the edges of the game box.
    const width = game.clientWidth;
    const height = game.clientHeight;

    // Math.abs(n) is n without its minus sign. Setting the direction like
    // this, instead of flipping it with -velocity, means a Pac-Man that ends
    // up outside the box (say, after the window shrinks) always heads back
    // in, instead of flipping every frame and getting stuck.
    if (pac.position.x + SIZE >= width) {
        pac.velocity.x = -Math.abs(pac.velocity.x); // go left
    } else if (pac.position.x <= 0) {
        pac.velocity.x = Math.abs(pac.velocity.x);  // go right
    }

    if (pac.position.y + SIZE >= height) {
        pac.velocity.y = -Math.abs(pac.velocity.y); // go up
    } else if (pac.position.y <= 0) {
        pac.velocity.y = Math.abs(pac.velocity.y);  // go down
    }

    // Face the way it's moving. (condition ? a : b gives a if the condition
    // is true, otherwise b.)
    const direction = pac.velocity.x >= 0 ? 0 : 1;
    if (direction !== pac.direction) {
        pac.direction = direction;
        setPicture(pac);
    }
}

// One button both starts and pauses, so there's only ever one loop.
function toggleGame() {
    running = !running;
    startButton.textContent = running ? 'Pause' : 'Start Game';
}

// "() => makeOne()" calls makeOne with no position. Passing makeOne itself
// would hand it the click event as x.
document.getElementById('add').addEventListener('click', () => makeOne());
startButton.addEventListener('click', toggleGame);

// Click inside the game box to add a Pac-Man centred on that spot.
// event.clientX and clientY count from the window's corner, so subtract the
// box's corner (and its border, clientLeft and clientTop) to get a position
// inside the box.
game.addEventListener('click', (event) => {
    const box = game.getBoundingClientRect();
    const x = event.clientX - box.left - game.clientLeft;
    const y = event.clientY - box.top - game.clientTop;
    makeOne(x - SIZE / 2, y - SIZE / 2);
});

requestAnimationFrame(loop); // start the loop; nothing moves until Start Game
