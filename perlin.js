//Empty template

class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(800);
		this.canvas.height(600);
		this.seed = Date.now();
	}

	preload()
	{
	}

	update()
	{
		this.requestUpdate();
		this.canvas.clear();

		let base = 200;
		let width = this.canvas.width();
		Utils.seed = this.seed;

		for (let x = 0; x < width; x++)
		{
			let y = Utils.seedRandFloat() * base;
			this.canvas.line(x, y, x, base, 'lime');
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