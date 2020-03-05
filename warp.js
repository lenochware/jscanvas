//Empty template

class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(800);
		this.canvas.height(600);

		this.screen = this.canvas.image();
		this.warp = new WarpTexture(this, 'lava');
	}

	preload()
	{
		this.loadImage('lava', 'images/lava.png');
	}

	update()
	{
		this.requestUpdate();

		this.warp.draw(this.screen, 100, 100, 150, 150);
		this.canvas.image(this.screen);

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
		this.game = game;
		this.image = game.canvas.getImageData(game.assets[asset].data);
		this.scale = 1;
		// this.tileWidth = Math.floor(this.image.width / x);
		// this.tileHeight = Math.floor(this.image.height / y);
	}

	draw(im, x0, y0, w, h)
	{
		for(let y = 0; y < h; y++) {
			for(let x = 0; x < w; x++) {

				let xin = Math.floor((x * this.scale) % this.image.width);
				let yin = Math.floor((y * this.scale) % this.image.height);

				let p = this.game.canvas.getPixel(this.image, xin, yin);
				im.putPixel(x + x0, y + y0, p);
			}
		}

		// let c = this.game.canvas;
		// c.getPixel(this.image, x, y);
		// c.putPixel(im, x, y, pixel);
	}
}