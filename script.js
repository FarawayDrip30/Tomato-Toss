"use strict";

let canvas = document.getElementById("tomatoCanvas");
let ctx = canvas.getContext("2d");

let tomatoRadius = 10;

let critter = {
	width: 50,
	height: 75,
	canMove: true,
};
critter.x = canvas.width / 2 - critter.width / 2;
critter.y = canvas.height - critter.height;

let keymap = {
	left: false,
	right: false,
};

let score = 0;

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawTomato();
	bounceTomatoes();
	drawCritter();
	drawScore();
	requestAnimationFrame(draw);
}

function drawTomato() {
	for (let t of tomatoes) {
		t.x += t.xv;
		t.y += t.yv;
		t.yv += .15;

		ctx.beginPath();
		ctx.arc(t.x, t.y, tomatoRadius, 0, Math.PI * 2);
		ctx.fillStyle = "#fc0339";
		ctx.fill();
		ctx.closePath();
	}
}

function bounceTomatoes() {
	for (let t of tomatoes) {
		if (t.x <= 0 + tomatoRadius || t.x >= canvas.width - tomatoRadius)
			t.xv *= -1; // bounce off wall
		if (t.y > canvas.height - tomatoRadius - critter.height) {
			if (t.x < critter.x + critter.width && t.x > critter.x) {
				t.yv = Math.random() * -2 - 8;
				playSound("bounce");
				score += 10;
			} else {
				if (t.x < critter.x && t.x > critter.x - tomatoRadius) {
					t.xv = -t.xv;
					t.x = t.x - 1;
					critter.canMove = false;
				} else {
					if (t.x < critter.x + critter.width + tomatoRadius && t.x > critter.x + critter.width) {
						t.xv = -t.xv;
						t.x = t.x + 1;
						critter.canMove = false;
					}
				}
			}
		}
		if (t.y > canvas.height - tomatoRadius)
			gameOver();
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

function gameOver() {
	document.location.reload();
	alert("Game Over");
}

let tomatoes = [
	{ x: canvas.width / 3, y: canvas.height - 300, xv: 4, yv: 0 },
	{ x: canvas.width / 3 * 2, y: canvas.height - 80, xv: 3, yv: -8 },
];

function startGame() {
	canvas.removeEventListener("mousedown", startGame);

	document.addEventListener("keydown", keyHandler(true));
	document.addEventListener("keyup", keyHandler(false));
	canvas.addEventListener("mousemove", mouseMoveHandler);

	draw();
}
canvas.addEventListener("mousedown", startGame);
ctx.font = "128px Arial";
ctx.fillStyle = "#000";
ctx.fillText("Click to start", 8, 128);