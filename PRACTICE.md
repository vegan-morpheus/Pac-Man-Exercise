# Practice guide

Rebuild every fix and improvement yourself, starting from the original bootcamp code. Each exercise matches one commit in this repository, so you always have an answer to check against.

The explainer site walks through all of this with moving diagrams: https://claude.ai/artifact/FwBcPvFGKuQ3fB5zL58Jwd (private to your Claude account). Each exercise names the chapter that covers it.

## Before you start

1. **Get the code** (skip this if you already have it):
   ```
   git clone https://github.com/vegan-morpheus/Pac-Man-Exercise.git
   cd Pac-Man-Exercise
   ```
2. **Make a practice branch from the original version:**
   ```
   git switch -c practice bootcamp-original
   ```
   (On an older Git, use `git checkout -b practice bootcamp-original`.) Your files are now exactly as they were at the bootcamp. `main` isn't touched, so you can't break anything.
3. **Open `index.html` in Chrome or Firefox** by double-clicking it.
4. **Open the developer tools** with F12, or Cmd+Option+I on a Mac, and keep the **Console** tab visible. It shows errors, and you can type JavaScript into it to inspect things, like `pacMen[0].position`.
5. **After each exercise**, reload the page to test it, then save your progress:
   ```
   git add -A
   git commit -m "Exercise 1: fix the bounce glitch"
   ```

**Checking your work.** Every exercise links to the answer commit. To compare your files with it:
```
git diff a36e6bd -- index.html
```
Swap in the commit from the exercise. Small differences are fine if your version works. Try the exercise before you open the hints, and open the hints one at a time.

---

## Part 1: fix the original

Line numbers in Part 1 refer to the original `index.html`.

### Exercise 1: The glitch from the README

**Goal:** stop the Pac-Men turning into an empty box when they bounce off a side wall.

**Try first:** add a few Pac-Men, press Start Game, and watch the Console as one hits a side wall.

<details><summary>Hint 1</summary>

Each bounce puts a red error in the Console: `Failed to load resource`. (Opened from your computer it says `net::ERR_FILE_NOT_FOUND`; on a website it says 404.) The browser couldn't find a picture. Click the error to see which file it wanted.
</details>

<details><summary>Hint 2</summary>

Compare the folder in that path with the folders in your project.
</details>

<details><summary>Hint 3</summary>

Look at lines 75, 78, 83 and 86.
</details>

**It works when:** there are no more red errors and no empty boxes at the walls.
**Answer:** [a36e6bd](https://github.com/vegan-morpheus/Pac-Man-Exercise/commit/a36e6bd) · explainer chapter 9

### Exercise 2: Standards mode

**Goal:** add `<!DOCTYPE html>` as the first line without breaking anything.

**Try first:** add only the doctype and reload. What happens to the Pac-Men? Then work out why and fix it.

<details><summary>Hint 1</summary>

Type `document.compatMode` in the Console with and without the doctype. `"BackCompat"` means quirks mode, and `"CSS1Compat"` means standards mode.
</details>

<details><summary>Hint 2</summary>

With the doctype, type `pacMen[0].position.x` and then `pacMen[0].newimg.style.left` in the Console. Why is one of them empty?
</details>

<details><summary>Hint 3</summary>

CSS lengths need a unit. Four lines set `left` or `top` (28, 29, 46, 47).
</details>

**It works when:** `document.compatMode` says `"CSS1Compat"` and the Pac-Men still move.
**Answer:** [c766846](https://github.com/vegan-morpheus/Pac-Man-Exercise/commit/c766846) · explainer chapter 10

### Exercise 3: Start only once

**Goal:** pressing Start Game more than once shouldn't make anything faster.

**Try first:** press Start Game three times. Why does it speed up?

<details><summary>Hint 1</summary>

Every press runs `update()`, and every `update()` books another run of itself with `setTimeout`. Nothing ever stops one of those chains.
</details>

<details><summary>Hint 2</summary>

The program needs to remember whether it has already started. That memory has to live outside the function, in a variable like `let started = false;`.
</details>

<details><summary>Hint 3</summary>

Write a `startGame()` function that returns straight away if `started` is true, and otherwise sets it to true and starts both loops. Point the button at it.
</details>

**It works when:** pressing Start Game again and again doesn't change the speed.
**Answer:** [efda542](https://github.com/vegan-morpheus/Pac-Man-Exercise/commit/efda542) · explainer chapter 8

### Exercise 4: Tidy up

**Goal:** remove everything that does nothing.

**Find:** three variables that are never used, the extra pictures on line 26, two attributes that appear on both buttons and do nothing, a style that has no visible effect, and a typo.

<details><summary>Hint</summary>

Search the file (Ctrl+F) for each variable name. If a name only appears where it's created, nothing ever uses it.
</details>

**It works when:** the game behaves exactly as before, with less code.
**Answer:** [0012599](https://github.com/vegan-morpheus/Pac-Man-Exercise/commit/0012599) · explainer chapter 10

**Checkpoint:** `git diff 0012599 -- index.html` should show little or nothing. You've now rebuilt version 1, fixed.

---

## Part 2: build version 2

### Exercise 5: Three files

**Goal:** split the page into `index.html`, `style.css` and `pacman.js`, with no change in behavior.

- Move the heading's inline style into `style.css`, and load it with `<link rel="stylesheet" href="style.css">`.
- Move all the JavaScript into `pacman.js`, and load it in the `<head>` with `<script src="pacman.js" defer></script>`.
- Give the buttons `id`s, remove their `onclick` attributes, and connect them from `pacman.js` with `addEventListener`.

**Experiment:** remove `defer` and reload. Read the Console error, `Cannot read properties of null (reading 'addEventListener')`, and work out why it happens. Then put `defer` back.

**It works when:** the game works as before, with no Console errors.
**Answer:** [18edb68](https://github.com/vegan-morpheus/Pac-Man-Exercise/commit/18edb68) · explainer chapter 13

### Exercise 6: The picture follows the numbers

**Goal:** choose each picture with `pacArray[direction][mouth]` instead of searching addresses with `indexOf`.

- Put `pacArray` back at the top of `pacman.js`.
- Give each Pac-Man two numbers: `direction` (0 right, 1 left) and `mouth` (0 open, 1 closed).
- Write `setPicture(item)`, which sets the picture from those two numbers.
- In `update_mouth`, replace the whole `if` chain with `item.mouth = 1 - item.mouth;` and then `setPicture(item)`.
- In `checkCollisions`, a side bounce just sets `direction`.
- Give the pictures a CSS class with `width: 100px; height: 100px; object-fit: contain;`, so `pacman1.png` stops coming out taller.

**It works when:** searching for `indexOf` finds nothing, and the Pac-Men still chomp and turn around without swelling.
**Answer:** [313795c](https://github.com/vegan-morpheus/Pac-Man-Exercise/commit/313795c) · explainer chapter 14

### Exercise 7: A box to play in

**Goal:** keep the Pac-Men inside a game box under the buttons.

- Move the buttons out of `#game` into their own `<div>`, so `#game` is an empty box.
- In CSS, give `#game` `position: relative`, a height, a border and `overflow: hidden`.
- Bounce off `game.clientWidth` and `game.clientHeight` instead of the window.
- Start new Pac-Men anywhere inside the box.

**Experiment:** with the box working and the old `-velocity` bounce still in place, start the game and quickly make the window narrower. Watch for Pac-Men that get stuck. Then change the bounce to set the sign with `Math.abs`, for example `velocity.x = -Math.abs(velocity.x)` at the right wall.

**It works when:** the Pac-Men never cover the buttons, and shrinking the window doesn't strand any of them.
**Answer:** [b76faef](https://github.com/vegan-morpheus/Pac-Man-Exercise/commit/b76faef) · explainer chapter 15

### Exercise 8: One clock, Pause, and click to add

This is the biggest exercise, so do it in four steps and commit after each one. The answer is a single commit with all four.

- **8a: one loop.** Replace both `setTimeout` loops with one `loop(time)` function that calls `requestAnimationFrame(loop)` at the end. Work out `dt`, the seconds since the last frame, and move by `velocity * dt`. Speeds are now pixels per second. Hint: the old velocities were pixels per 20 ms, so multiplying by 50 gives the same speed in pixels per second.
- **8b: the mouths on the same clock.** Add up `dt` in a `chompTimer`. When it reaches 0.2, swap the mouths and subtract 0.2.
- **8c: Start and Pause.** Keep a `running` variable. `loop` only moves things while it's true. The button runs `running = !running` and changes its own text.
- **8d: click to add.** Listen for clicks on the game box. Turn `event.clientX` and `event.clientY` into a position inside the box (see explainer chapter 17), then keep it inside with `Math.max` and `Math.min`. Bonus: make new Pac-Men head off in random directions.

**It works when:** the Pac-Men move at the same speed as before, Pause really pauses, and clicking the box adds a Pac-Man centred where you clicked.
**Answer:** [8809639](https://github.com/vegan-morpheus/Pac-Man-Exercise/commit/8809639) · explainer chapters 16 and 17

**Checkpoint:** `git diff 8809639 -- index.html style.css pacman.js`. You've rebuilt version 2.

---

## Experiments

Change one thing in version 2, predict what will happen, then reload and check:

- `CHOMP_EVERY = 0.05`
- `MAX_SPEED = 1200`
- `SIZE = 50`. What else has to change for the pictures to match? (Look at `style.css`.)
- Remove `overflow: hidden` from `#game`, then make the window smaller while it runs.
- Remove the `Math.min(..., 0.1)` cap on `dt`, switch to another tab for a minute, then come back.

## Challenges

These have no answer commits. Ask Claude if you get stuck.

1. **Remove PacMan:** a button that removes the newest Pac-Man. (`pacMen.pop()` gives it back to you, and its picture has a `.remove()` method.)
2. **A counter:** show "Pac-Men: 5" next to the buttons, and keep it up to date.
3. **Spacebar:** pause and resume with the spacebar. (Listen for `keydown` and check `event.code === 'Space'`.)
4. **Speed slider:** an `<input type="range">` that speeds every Pac-Man up or slows them down.
5. **Different sizes:** give each Pac-Man a random size. The walls will need each Pac-Man's own size instead of `SIZE`.
6. **Harder:** make Pac-Men bounce off each other. Two Pac-Men touch when the distance between their centres is less than the sum of their radii.

## When you're done

Your practice branch is yours to keep. You can push it to GitHub as its own branch with `git push -u origin practice`, but don't merge it into `main`, because `main` already has the finished version. To start over, run `git switch main`, delete the branch with `git branch -D practice`, and create it again.
