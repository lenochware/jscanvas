//Empty template

class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(800);
		this.canvas.height(600);
	}

	preload()
	{
		this.loadImage('lava', 'images/lava.png');
	}

	update()
	{
		this.requestUpdate();
		this.canvas.clear();

		if (this.kb.key == 'SomeKey') {
			this.kb.key = '';
		};

		if (this.mouse.buttons) {
			this.mouse.buttons = 0;
		}
		
		this.time = this.now();
	}
}

class WarpTexture
{
	constructor(game, asset)
	{
		this.canvas = game.canvas;
		this.image = asset.data;
		// this.tileWidth = Math.floor(this.image.width / x);
		// this.tileHeight = Math.floor(this.image.height / y);
	}

	draw(ti, dx, dy)
	{
		let sx = ti % this.x * this.tileWidth;
		let sy = Math.floor(ti / this.x) * this.tileHeight;
		this.canvas.context.drawImage(this.image, sx, sy, this.tileWidth, this.tileHeight, dx, dy, this.tileWidth, this.tileHeight);
	}
}