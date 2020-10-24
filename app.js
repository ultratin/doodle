document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid');
	const doodler = document.createElement('div');

	let doodlerLeftSpace = 50;
	let startPoint = 150;
	let doodlerBottomSpace = startPoint;
	let isGameOver = false;
	let platformCount = 5;
	let platforms = [];
	let upTimerId;
	let downTimerId;
	let leftTimerId;
	let rightTimerId;
	let isJumping = true;
	let isGoingLeft = false;
	let isGoingRight = false;
	let score = 0;


	function createDoodler() {
		grid.appendChild(doodler);
		doodler.classList.add('doodler');
		doodlerLeftSpace = platforms[0].left;
		doodler.style.left = doodlerLeftSpace + 'px';
		doodler.style.bottom = doodlerBottomSpace + 'px';
	}

	class Platform {
		constructor(newPlatBottom) {
			this.newPlatBottom = newPlatBottom;
			this.left = Math.random() * 315;
			this.visual = document.createElement('div');

			const visual = this.visual;
			visual.classList.add('platform');
			visual.style.left = this.left + 'px';
			visual.style.bottom = newPlatBottom + 'px';
			grid.appendChild(visual);
		}
	}

	function createPlatforms() {
		let platGap = 600 / platformCount;
		for (let i = 0; i < platformCount; i++) {
			let newPlatBottom = 100 + i * platGap;
			let newPlat = new Platform(newPlatBottom);
			platforms.push(newPlat);
		}
	}

	function movePlatforms() {
		if (doodlerBottomSpace > 150) {
			platforms.forEach(platform => {
				platform.newPlatBottom -= 4;
				let visual = platform.visual;
				visual.style.bottom = platform.newPlatBottom + 'px';

				if (platform.newPlatBottom < 10) {
					let firstPlatform = platforms[0].visual;
					firstPlatform.classList.remove('platform');
					platforms.shift();
					let newPlatform = new Platform(600);
					platforms.push(newPlatform);
					score++;
				}
			});
		}
	}

	function jump() {
		clearInterval(downTimerId);
		isJumping = true;
		upTimerId = setInterval(function () {
			doodlerBottomSpace += 20;
			doodler.style.bottom = addPx(doodlerBottomSpace);
			if (doodlerBottomSpace > startPoint + 200) {
				fall();
			}
		}, 20);
	}

	function fall() {
		clearInterval(upTimerId);
		isJumping = false;
		downTimerId = setInterval(() => {
			doodlerBottomSpace -= 5;
			doodler.style.bottom = addPx(doodlerBottomSpace);
			if (doodlerBottomSpace <= 0) {
				gameOver();
			}
			platforms.forEach(platform => {
				if ((doodlerBottomSpace >= platform.newPlatBottom) &&
					(doodlerBottomSpace <= platform.newPlatBottom + 15) &&
					((doodlerLeftSpace + 60) >= platform.left) &&
					(doodlerLeftSpace <= (platform.left + 85)) &&
					!isJumping
				) {
					console.log('landed');
					startPoint = doodlerBottomSpace;
					jump();
				}
			});
		}, 20);
	}

	function gameOver() {
		console.log('Game over');
		isGameOver = true;
		grid.innerHTML = score;
		clearInterval(upTimerId);
		clearInterval(downTimerId);
		clearInterval(leftTimerId);
		clearInterval(rightTimerId);
	}

	function control(e) {
		if (e.key === 'ArrowLeft') {
			moveLeft();
		} else if (e.key === 'ArrowRight') {
			moveRight();
		} else if (e.key === 'ArrowUp') {
			moveStraight();
		}
	}

	function moveLeft() {
		doodler.style.backgroundImage = "url('doodler-guy-left.png')";
		clearInterval(rightTimerId);
		isGoingRight = false;
		isGoingLeft = true;
		leftTimerId = setInterval(() => {
			if (doodlerLeftSpace >= 0) {
				doodlerLeftSpace -= 5;
				doodler.style.left = addPx(doodlerLeftSpace);
			} else {
				moveRight();
			}
		}, 20);
	}

	function moveRight() {
		doodler.style.backgroundImage = "url('doodler-guy.png')";
		clearInterval(leftTimerId);
		isGoingLeft = false;
		isGoingRight = true;
		rightTimerId = setInterval(() => {
			if (doodlerLeftSpace <= 340) {
				doodlerLeftSpace += 5;
				doodler.style.left = addPx(doodlerLeftSpace);
			} else {
				moveLeft();
			}
		}, 20);
	}

	function moveStraight() {
		isGoingRight = false;
		isGoingLeft = false;
		clearInterval(leftTimerId);
		clearInterval(rightTimerId);
	}

	function start() {
		if (!isGameOver) {
			createPlatforms();
			createDoodler();
			setInterval(movePlatforms, 20);
			jump();
			document.addEventListener('keyup', control);
		}
	}

	function addPx(pixelCount) {
		return pixelCount + 'px';
	}

	//TODO: attach to button
	start();
})