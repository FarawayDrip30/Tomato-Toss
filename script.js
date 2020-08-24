var canvas = document.getElementById("tomatoCanvas");
var ctx = canvas.getContext("2d");

var tomatoX = canvas.width / 2;
var tomatoY = canvas.height - 100;
var tomatoDX = 1.5;
var tomatoDY = -2;
var tomatoRadius = 10;

var momentumY = 100;

var critterHeight = 75;
var critterWidth = 50;
var critterX = canvas.width / 2 - critterWidth / 2;
var critterY = canvas.height - critterHeight;
var critterCanMove = true;

leftPressed = false;
rightPressed = false;

var score = 0;

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawTomato();
	bounceTomatoOffWalls();
	drawCritter();
	drawScore();
	requestAnimationFrame(draw);
}

function drawTomato() {

	for (var t of tomatoes) {
		t.x += t.xv;
		t.y += t.yv * (t.momentum / 50);
		t.momentum--;

		ctx.beginPath();
		ctx.arc(t.x, t.y, tomatoRadius, 0, Math.PI * 2);
		ctx.fillStyle = "#fc0339";
		ctx.fill();
		ctx.closePath();
	}

	/*
	ctx.beginPath();
	ctx.arc(tomatoX, tomatoY, tomatoRadius, 0, Math.PI*2);
	ctx.fillStyle = "#fc0339";
	ctx.fill();
	ctx.closePath();
	tomatoX += tomatoDX;
	tomatoY += tomatoDY*(momentumY/50);
	momentumY--;
	*/
}

function bounceTomatoOffWalls() {
	for (t of tomatoes) {
		if (t.x > canvas.width - tomatoRadius) {
			t.xv = -t.xv;
		}
		if (t.x < 0 + tomatoRadius) {
			t.xv = -t.xv;
		}
		if (t.y > canvas.height - tomatoRadius - critterHeight) {
			if (t.x < critterX + critterWidth && t.x > critterX) {
				t.momentum = Math.random() * 75 + 50;
				score += 10;
			}
			else {
				if (t.x < critterX && t.x > critterX - tomatoRadius) {
					t.xv = -t.xv;
					t.x = t.x - 1;
					critterCanMove = false;
				}
				else {
					if (t.x < critterX + critterWidth + tomatoRadius && t.x > critterX + critterWidth) {
						t.xv = -t.xv;
						t.x = t.x + 1;
						critterCanMove = false;
					}
				}
			}
		}
		if (t.y > canvas.height - tomatoRadius) {
			document.location.reload();
			alert("Game Over");
		}
	}
}

function drawCritter() {

	ctx.beginPath();
	ctx.rect(critterX, critterY, critterWidth, critterHeight);
	ctx.fillStyle = "#ff9d52";
	ctx.fill();
	ctx.closePath();

	if (rightPressed == true) {
		if (critterX < canvas.width - critterWidth) {
			if (critterCanMove == true) {
				critterX += 7;
			}
		}
	}
	if (leftPressed == true) {
		if (critterX > 0) {
			if (critterCanMove == true) {
				critterX -= 7;
			}
		}
	}
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#fc0339";
	ctx.fillText("Score: " + score, 8, 20);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
	if (e.key == "Right" || e.key == "ArrowRight") {
		rightPressed = true;
	}
	else if (e.key == "Left" || e.key == "ArrowLeft") {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.key == "Right" || e.key == "ArrowRight") {
		rightPressed = false;
	}
	else if (e.key == "Left" || e.key == "ArrowLeft") {
		leftPressed = false;
	}
}

function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX > 0 + critterWidth / 2 && relativeX < canvas.width - critterWidth / 2) {
		if (critterCanMove == true) {
			critterX = relativeX - critterWidth / 2;
		}
	}
	else {
		if (relativeX < canvas.width / 2) {
			if (critterCanMove == true) {
				critterX = 0;
			}
		}
		if (relativeX > canvas.width / 2) {
			if (critterCanMove == true) {
				critterX = canvas.width - critterWidth;
			}
		}
	}
}

createjs.Sound.registerSound("bounce.WAV", "bounce");

function bounceSoundActivate() {
	var bounceSound = createjs.Sound.play("bounce");
	bounceSound.volume = 0.5;
}

bounceSoundActivate();

let tomatoes = [{ x: canvas.width / 2, y: canvas.height - 100, xv: 1.5, yv: -2, momentum: 100 }, { x: canvas.width / 2, y: canvas.height - 150, xv: 1.5, yv: -2, momentum: 100 }];

draw();