class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(800);
		this.canvas.height(600);
	}

	preload()
	{
		this.loadImage('tiles', 'images/tiles.png');		
	}

	update()
	{
		this.requestUpdate();

		let tileSet = new Tileset(this, this.assets.tiles, 16, 4);

		this.canvas.clear();
		//this.canvas.context.drawImage(this.assets.tiles.data, 10,10);
		
		tileSet.draw(13+16, 10,10);

		this.time = this.now();
	}
}

class Tileset
{
	constructor(game, asset, x, y)
	{
		this.canvas = game.canvas;
		this.image = asset.data;
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
