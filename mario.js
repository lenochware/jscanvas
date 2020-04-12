//Empty template

class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(400);
		this.canvas.height(300);

		let tileSet = new Tileset(this, this.assets.tiles, 26, 24);
		let playerTiles = new Tileset(this, this.assets.player, 28, 1);

		this.player = new Player(this, playerTiles, 50, 50);


		this.level = new Level(tileSet, [
			"...................................................",
			"...................................................",
			"...................................................",
			"...................................................",
			"...................................................",
			"...................................................",
			"...................................................",
			"...###...........................###...............",
			"...................................................",
			"..............#....................................",
			"###################################################",
		]);
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
		this.height = levelMap.length;
		for(let s of levelMap) {
			this.map.push(s.split(""));
		}
		this.width = this.map[0].length;
	}

	get(x, y)
	{
		let tx = Math.floor(x / this.tileSet.tileWidth);
		let ty = Math.floor(y / this.tileSet.tileHeight);

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
		this.vx = this.vx - Math.sign(this.vx) * 0.05;
		if (Math.abs(this.vx) < 0.1) this.vx = 0;

		this.vy = this.vy - Math.sign(this.vy) * 0.05;
		if (Math.abs(this.vy) < 0.1) this.vy = 0;
	}

	update()
	{
		if (this.game.kbmap['ArrowLeft']) this.vx -= 0.2;
		if (this.game.kbmap['ArrowRight']) this.vx += 0.2;
		
		this.vx = Utils.clamp(this.vx, -3, 3);

		//y
		if (this.game.kbmap['ArrowUp']) this.vy -= 0.2;
		if (this.game.kbmap['ArrowDown']) this.vy += 0.2;
		
		this.vy = Utils.clamp(this.vy, -3, 3);

		this.decel();

		let x = this.x + this.vx;
		let y = this.y + this.vy;

		if (this.game.level.get(x, y) == '#' 
			|| this.game.level.get(x + this.width, y) == '#')
		{
			this.vx = 0;
			x = this.x;
		}

		if (this.game.level.get(x + this.width, y + this.height) == '#' 
			|| this.game.level.get(x, y + this.height) == '#') 
		{
			this.vy = 0;
			y = this.y;
		}

		this.x = x;
		this.y = y;
	}

	collides(x, y)
	{
		if (this.game.level.get(x + this.width, y + this.height) == '#') return true;
		if (this.game.level.get(x, y + this.height) == '#') return true;

		return false;
	}

	draw()
	{
		this.tiles.draw(2, Math.floor(this.x), Math.floor(this.y));
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