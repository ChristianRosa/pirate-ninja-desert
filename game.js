let levelPlan = `
...............................................
...............................................
...............................................
...................oooooooooo..................
................o..##..##..##..o...............
...............................................
................#..............#...............
...............................................
...#..o.o..o.#...................#...o..o..#...
...##.......##...................##.......##...
....#########.....................#########....
...............................................
...............................................

`

class Level {
	constructor(plan){
		let rows = plan.trim().split("/n").map(l => [...l]);
		let height = rows.length;
		let width = rows[0].length;
		let startActors = [];

		this.rows = rows.map((row,y) => {
			return row.map((tile,x) => {
				let type = levelTiles[tile];
				if(typeof type == "string") return type;
				this.startActors.push(
					type.create(new Vec(x,y),tile));
				return "empty";
			});
		});
	}
}

////Actor Classes

//Player
class Player {
	constructor(pos, speed){
		this.pos = pos;
		this.speed = speed;
	}

	get type() {return "player";}

	static create(pos){
		return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0));
	}
}

Player.prototype.size = new Vec(0.8, 1.5);

//Lava
class Lava {
	constructor(pos,speed,reset) {
		this.pos = pos;
		this.speed = speed;
		this.reset = reset;
	}

	get type() {return "lava"}

	static create(pos,tile){
		if(tile == "="){
			return new Lava(pos,new Vec(2,0));
		} else if (tile == "|"){
			return new Lava(pos, new Vec(0,2));
		} else if (tile == "v"){
			return new Lava(pos, new Vec(0,3), pos);
		}
	}
}

Lava.prototype.size = new Vec(1,1);

//Coin
class Coin {
	constructor(pos,basePos,wobble){
		this.pos = pos;
		this.basePos = basePos;
		this.wobble = wobble;
	}

	get type() {return "coin";}

	static create(pos){
		let basePos = pos.plus(new Vec(0.2,0.1));
		return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
	}
}


Coin.prototype.size = new Vec(0.6 ,0.6);


//State management

class State {
	constructor(level, actors, status){
		this.level = level;
		this.actors = actors;
		this.status = status;
	}

	static start(level){
		return new State(level, level.startActors,"playing");
	}

	get player(){
		return this.actors.find(a => a.type == "player")
	}
}

//Vector Class

class Vec{
	constructor(x,y){
		this.x = x; 
		this.y = y;
	}
	plus(other){
		return new Vec(this.x + other.x, this.y + other.y);
	}
	times(factor){
		return new Vec(this.x * other.x, this.y + other.y);
	}
}

const levelTiles = {
	".": "empty", 
	"#": "wall",
	"+": "lava",
	"@": Player, 
	"o": Coin, 
	"=": Lava, 
	"|": Lava,
	"v": Lava
};