class Main extends NextGame {

	init()
	{
		super.init();
		this.canvasImage = this.canvas.image();
	}

	update()
	{
		this.requestUpdate();

		//if (this.now() - this.time < 30) return;

		let im = this.canvasImage;

		//---

		this.canvas.image(im);

		this.canvas.text(20, 20, '#3f3', this.kb.key);

		if(this.mouse.buttons) {
			this.canvas.circle(this.mouse.x, this.mouse.y, 10, 'lime');
			this.mouse.buttons = 0;
		}

		this.time = this.now();
	}

}