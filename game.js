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
					type.create(new Vec(x,y)ss
			});
		});
	}
}

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