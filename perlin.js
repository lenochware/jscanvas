//Empty template

class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(800);
		this.canvas.height(600);
		this.seed = Date.now();
		this.offset = 0;
		console.log(Utils.perlin.noise(0.1));
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

		if (this.kb.key != 'p') this.offset++;

		let y = 0;

		// for (let x = 0; x < width; x++)
		// {
		// 	//let y = Utils.seedRandFloat() * base;
		// 	y += Utils.seedRandom(-3,4);
		// 	this.canvas.line(x, y, x, base, y>base? 'blue':'lime');
		// }

		for (let x = 0; x < width; x++)
		{
			y = base - this.sum(x + this.offset);
			this.canvas.line(x, y, x, base, y>base? 'blue':'lime');
		}


		if (this.kb.key == 'n') {
			this.seed = Date.now();
			this.kb.key = '';
		};

		if (this.mouse.buttons) {
		}
		
		this.time = this.now();
	}

	sum(x)
	{
		let y = 0;
		for (let i = -16; i <= 16; i++)
		{
			Utils.seed = x + i;
			y += Utils.seedRandom(-4,8);
		}
		return y;
	}
}