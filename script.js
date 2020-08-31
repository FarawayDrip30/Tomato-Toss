"use strict";

let canvas = document.getElementById("tomatoCanvas");
let ctx = canvas.getContext("2d");

const GRAVITY = .15;

let keymap = {
	left: false,
	right: false,
};

let tomatoes, // variables that get reset (set in function restartGame)
	critter,
	score;

/**
 * draw
 */
let draw,
	stopDraw;
{
	let lastTime;
	let lastDeltaTime;
	let drawRequest;
	draw = function () {
		let time = performance.now();
		let deltaTime; // calculated so that the game doesn't slow down on slow computers
		if (typeof lastTime == "number")
			deltaTime = (time - lastTime + lastDeltaTime) / 16; // smoothed out with last deltatime to deal with time imprecision
		// divided by 16 to slow down game speed
		else
			deltaTime = 0; // when the game starts there's no last draw
		lastTime = time;
		lastDeltaTime = deltaTime;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		moveTomatoes(deltaTime);
		drawTomato();
		drawCritter();
		drawScore();
		drawRequest = requestAnimationFrame(draw);
	};
	stopDraw = function () {
		lastTime = undefined;
		lastDeltaTime = undefined;
		cancelAnimationFrame(drawRequest);
	};
}

function drawTomato() {
	for (let t of tomatoes) {
		ctx.beginPath();
		ctx.arc(t.x, t.y, t.s, 0, Math.PI * 2);
		ctx.fillStyle = "#fc0339";
		ctx.fill();
		ctx.closePath();
	}
}

function drawCritter() {
	ctx.fillStyle = "#ff9d52";
	ctx.fillRect(critter.x, critter.y, critter.width, critter.height);
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#fc0339";
	ctx.fillText("Score: " + score, 8, 20);
}

/**
 * game logic
 */
function moveTomatoes(deltaTime) {
	for (let t of tomatoes) {
		// move tomatoes
		t.x += t.xv * deltaTime;
		t.y += t.yv * deltaTime;
		t.yv += GRAVITY * deltaTime;

		// bounce tomatoes
		if (t.x <= t.s || t.x >= canvas.width - t.s)
			t.xv *= -1; // bounce off wall

		if (t.fallen) { // already went past top of critter (missed bounce), impossible to get tomato
			if (t.x < critter.x && t.x > critter.x - t.s) {
				t.xv = -t.xv; // bounce off critter side
				t.x = t.x - 1;
			} else if (t.x < critter.x + critter.width + t.s && t.x > critter.x + critter.width) {
				t.xv = -t.xv; // bounce off critter side
				t.x = t.x + 1;
			}
			if (t.y > canvas.height - t.s)
				setTimeout(gameOver, 0); // hit floor
			// timeout used because gameOver doesn't work while draw is running
		} else if (t.y >= canvas.height - t.s - critter.height && // in critter area (bottom of screen)
			t.yv >= 0 // not moving up
		) {
			if (t.x + t.s > critter.x && t.x - t.s < critter.x + critter.width) {
				t.yv = Math.random() * -2 - 8; // bounce off top of critter
				playSound("bounce");
				score += 10;
			} else {
				t.fallen = true; // didn't bounce off top, now impossible to get tomato
				critter.canMove = false;
			}
		}
	}
}

/**
 * player movement
 */
function keyHandler(state) { // returns another function, the inside function is used in the event handler
	return function ({ code: key }) {
		switch (key) {
			case "ArrowRight":
				keymap.right = state;
				break;
			case "ArrowLeft":
				keymap.left = state;
				break;
		}
	};
}

function mouseMoveHandler(e) {
	if (critter.canMove == true) {
		let x = e.clientX - canvas.offsetLeft;
		if (x >= 0 && x < canvas.width - critter.width / 2)
			critter.x = x - critter.width / 2;
		else
			if (x < 0)
				critter.x = 0;
			else
				critter.x = canvas.width - critter.width;
	}
}

/**
 * audio
 */
let audio = { // add other audio elements if needed
	bounce: document.getElementById("audioBounce"),
};
audio.bounce.volume = .5;

function playSound(sound, action = "restart") {
	switch (action) {
		case "restart":
			audio[sound].currentTime = 0;
			audio[sound].play();
			break;
		case "play":
		case "unpause":
			audio[sound].play();
			break;
		case "pause":
			audio[sound].pause();
			break;
		case "stop":
			audio[sound].pause();
			audio[sound].currentTime = 0;
			break;
	}
}

/**
 * game begin and end
 */
function gameOver() {
	stopDraw();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.font = "64px Arial";
	ctx.fillStyle = "#F00";
	ctx.fillText(`Game over! Score: ${score}`, 8, 64);
	restartGame(200);
}

function startGame() {
	canvas.removeEventListener("mousedown", startGame);
	draw();
}

function restartGame(textHeight = 128) { // different height used for game over
	tomatoes = [
		{ x: canvas.width / 3, y: canvas.height - 300, xv: 4, yv: 0, s: 10, }, // xv and yv are speed/velocity/momentum, s is size (radius)
		{ x: canvas.width / 3 * 2, y: canvas.height - 80, xv: 3, yv: -8, s: 8, },
	];

	critter = {
		width: 50,
		height: 75,
		canMove: true,
	};
	critter.x = canvas.width / 2 - critter.width / 2;
	critter.y = canvas.height - critter.height;

	score = 0;

	canvas.addEventListener("mousedown", startGame);

	ctx.font = "128px Arial";
	ctx.fillStyle = "#000";
	ctx.fillText("Click to start", 8, textHeight);
}

document.addEventListener("keydown", keyHandler(true)); // keyboard movement unfinished
document.addEventListener("keyup", keyHandler(false));
canvas.addEventListener("mousemove", mouseMoveHandler);
restartGame();