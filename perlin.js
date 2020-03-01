//Empty template

class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(800);
		this.canvas.height(600);
		this.seed = Date.now();
		this.offset = 0;
	}

	preload()
	{
	}

	update()
	{
		this.requestUpdate();
		this.canvas.clear();

		let base = 300;
		let width = this.canvas.width();
		//Utils.seed = this.seed;

		if (this.kb.key != 'p') this.offset += 0.01;

		let y = 0;

		let xoff = 0;
		for (let x = 0; x < width; x++)
		{
			y = Math.floor(base - Utils.perlin.noise(this.offset + xoff) * 200);
			this.canvas.line(x, y, x, base, y>base? 'blue':'lime');
			xoff += 0.01;
		}


		if (this.kb.key == 'n') {
			this.seed = Date.now();
			this.kb.key = '';
		};

		if (this.mouse.buttons) {
		}
		
		this.time = this.now();
	}
}