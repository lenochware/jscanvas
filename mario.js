//Empty template

class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(400);
		this.canvas.height(300);

		let tileSet = new Tileset(this, this.assets.tiles, 26, 24);
		let playerTiles = new Tileset(this, this.assets.player, 28, 1);

		this.level = new Level(tileSet, [
			"...................................................",
			"...................................................",
			"...................................................",
			"...................................................",
			"...................................................",
			"...................................................",
			"...................................................",
			"...###...#.#.....................###...............",
			"...................................................",
			"..............#....................................",
			"###################################################",
		]);

		this.player = new Player(this, playerTiles, 5, 5);
	}

	preload()
	{
		this.loadImage('player', 'images/mario.png');	
		this.loadImage('tiles', 'images/mario-tiles.png');	
	}

	update()
	{
		this.requestUpdate();
		this.canvas.fill('lightblue');
		this.canvas.text(10, 10, 'white', this.player.x + ', ' + this.player.y);

		this.level.draw();
		this.player.update();
		this.player.draw();

		if (this.kb.key == 'SomeKey') {
			this.kb.key = '';
		};

		if (this.mouse.buttons) {
			this.mouse.buttons = 0;
		}
		
		this.time = this.now();
	}
}


class Level
{
	constructor(tileSet, levelMap)
	{
		this.map = [];
		this.tileSet = tileSet;
		this.tileWidth = tileSet.tileWidth;
		this.tileHeight = tileSet.tileHeight;
		this.height = levelMap.length;
		for(let s of levelMap) {
			this.map.push(s.split(""));
		}
		this.width = this.map[0].length;
	}

	get(x, y)
	{
		let tx = Math.floor(x);
		let ty = Math.floor(y);

		if (tx < 0 || ty < 0 || tx > this.width || ty > this.height) return null;

		return this.map[ty][tx];
	}

	draw()
	{
		let ti = {"#": 3};
		for(let y = 0; y < 11; y++) {
			for (let x = 0; x < 30; x++) {
				let c = this.map[y][x];
				if (c == '.') continue;
				this.tileSet.draw(ti[c], x * this.tileSet.tileWidth, y * this.tileSet.tileHeight);
			}
		}
	}
}

class Player
{
	constructor(game, tiles, x, y)
	{
		this.game = game;
		this.level = game.level;
		this.tiles = tiles;
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.width = this.tiles.tileWidth;
		this.height = this.tiles.tileHeight;
	}

	decel()
	{
		this.vx = this.vx - Math.sign(this.vx) * 0.01;
		if (Math.abs(this.vx) < 0.01) this.vx = 0;

		this.vy = this.vy - Math.sign(this.vy) * 0.01;
		if (Math.abs(this.vy) < 0.01) this.vy = 0;
	}

	update()
	{
		if (this.game.kbmap['ArrowLeft']) this.vx -= 0.03;
		if (this.game.kbmap['ArrowRight']) this.vx += 0.03;
		
		this.vx = Utils.clamp(this.vx, -.3, .3);

		//y
		if (this.game.kbmap['ArrowUp']) this.vy -= 0.02;
		if (this.game.kbmap['ArrowDown']) this.vy += 0.02;
		
		this.vy = Utils.clamp(this.vy, -.3, .3);

		this.decel();

		this.newX = this.x + this.vx;
		this.newY = this.y + this.vy;

		this.checkCollision(0, 0);
		this.checkCollision(.99, 0);
		this.checkCollision(0, .99);
		this.checkCollision(.99, .99);

		this.x = this.newX;
		this.y = this.newY;
	}

	checkCollision(ax, ay)
	{
		let oX = this.x + ax;
		let oY = this.y + ay;
		let nX = this.x + this.vx + ax;
		let nY = this.y + this.vy + ay;

		if (this.level.get(nX, oY) != '.') {
			this.vx = 0;
			this.newX = Math.floor(oX);
		}

		if (this.level.get(oX, nY) != '.') {
			this.vy = 0;
			this.newY = Math.floor(oY);
		}

	}

	draw()
	{
		this.tiles.draw(2, 
			Math.floor(this.x * this.level.tileWidth), 
			Math.floor(this.y * this.level.tileHeight)
		);
	}
}

class Tileset
{
	constructor(game, asset, x, y)
	{
		this.canvas = game.canvas;
		this.image = asset.data;
		this.size = x * y;
		this.x = x;
		this.y = y;
		this.tileWidth = Math.floor(this.image.width / x);
		this.tileHeight = Math.floor(this.image.height / y);
	}

	draw(ti, dx, dy)
	{
		let sx = ti % this.x * this.tileWidth;
		let sy = Math.floor(ti / this.x) * this.tileHeight;
		this.canvas.context.drawImage(this.image, sx, sy, this.tileWidth, this.tileHeight, dx, dy, this.tileWidth, this.tileHeight);
	}
}