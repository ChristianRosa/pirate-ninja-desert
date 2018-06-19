//Determine if the actor is touching a wall
Level.prototype.touches = function(pos,size,type){
	let xStart = Math.floor(pos.x);
	let xEnd = Math.ceil(pos.x + size.x);
	let yStart = Math.floor(pos.y);
	let yEnd = Math.ceil(pos.y + size.y);

	for(let y = yStart; y < yEnd; y++){
		for(let x = xStart; x < xEnd; x++){
			let isOutside = x < 0 || x >= this.width ||
							y < 0 || y >= this.height;
			let here = isOutside ? "wall" : this.rows[y][x];
			if(here == type) return true;
		}
	}
	return false;
};

State.prototype.update = function(time, keys) {
	let actors = this.actors.map(actors => actors.update(time, this, keys));
	let newState = new State(this.level, actors, this.status);

	if(newState.status != "playing") return newState;

	let player = newState.player;
	if(this.level.touches(player.pos, player.size, "lava")) {
		return new State(this.level, actors, "lost");
	}

	for (let actor of actors) {
		if (actors != player && overlap(actor, player)){
			newState = actor.collide(newState);
		}
	}
	return newState;
};

function overlap(actor1,actor2){
	return actor1.pos.x + actor1.size.x > actor2.pos.x &&
			actor1.pos.x < actor2.pos.x + actor2.size.x &&
			actor1.pos.y + actor1.size.y > actor2.pos.y &&
			actor1.pos.y < actor2.pos.y + actor2.size.y;
}

Lava.prototype.collide = function(state){
	return new State(state.level, state.actors, "lost");
};

Coin.prototype.collide = function(state){
	let filtered = state.actors.filter(a => a != this);
	let status = state.status;
	if(!filtered.some(a => a.type == "coin")) status = "won";
	return new Status(state.level, filtered, status);
};

Lava.prototype.update = function(time, state) { 
	let newPos = this.pos.(this.speed.times(time));
	if(!state.level.touches(newPos, this.size, "wall")) {
		return new Lava(newPos, this.speed, this.reset);
	} else if (this.reset) {
		return new Lava(this.reset, this.speed, this.reset);
	} else {
		return new Lava(this.pos, this.speed.times(-1));
	}
};

const wobbleSpeed = 8, wobbleDist = 0.07;

Coin.prototype.update = function (time){
	let wobble = this.wobble + time * wobbleSpeed;
	let wobblePos = Math.sin(wobble) * wobbleDist;
	return new Coin(this.basePos.plus(new Vec(0,wobblePos)),this.basePos, wobble);
};

const playerXspeed = 7;
const gravity = 30;
const jumpSpeed = 17;

Player.prototype.update = function(time, state, keys) {
	let xSpeed = 0;
	if(key.ArrowLeft) xSpeed -= playerXSpeed;
	if(key.ArrowRight) xSpeed += playerXSpeed;
	let pos = this.pos;
	let movedX = pos.plus(new Vec(xSpeed * time, 0));
	if(!state.level.touches(movedX, this.size, "wall")) {
		pos = movedX;
	}

	let ySpeed = this.speed.y + time * gravity;
	let movedY = pos.plus(new Vec(0, ySpeed * time));
	if(!state.level.touches(movedY, this.size, "wall")) {
		pos = movedY;
	} else if (keys.ArrowUp && ySpeed > 0) {
		ySpeed = -jumpSpeed;
	} else {
		ySpeed = 0;
	}
	return new Player(pos,new Vec(xSpeed,ySpeed));
};

function trackKeys(keys) { 
	let down = Object.create(null);
	function track(event) {
		if(keys.includes(event.key)) {
			down[event.key] = event.type == "keydown";
			event.preventDefault();
		}
	}
	window.addEventListener("keydown", track);
	window.addEventListener("keyup", track);
	return down;
}

const arrowKeys = trackKeys(["ArrowLeft", "ArrowRight","ArrowUp"]);

