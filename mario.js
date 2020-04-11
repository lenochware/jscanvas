//Empty template

class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(400);
		this.canvas.height(300);

		let tileSet = new Tileset(this, this.assets.tiles, 26, 24);

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
		this.loadImage('tiles', 'images/mario-tiles.png');	
	}

	update()
	{
		this.requestUpdate();
		this.canvas.fill('lightblue');

		this.level.draw();

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
		return this.map[y][x];
	}

	draw()
	{
		let ti = {"#": 3};
		for(let y = 0; y < 11; y++) {
			for (let x = 0; x < 30; x++) {
				let c = this.get(x, y);
				if (c == '.') continue;
				this.tileSet.draw(ti[c], x * this.tileSet.tileWidth, y * this.tileSet.tileHeight);
			}
		}
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