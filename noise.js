class Main extends NextGame {

	init()
	{
		super.init();
		this.canvasImage = this.canvas.image();
	}


	update()
	{
		let im = this.canvasImage;

		//console.log(this.elapsedTime);


		for (let y = 0; y < im.height; y++)
		{
			for (let x = 0; x < im.width; x++)
			{
				im.putPixel(x, y, this.randomPixel());
			}
		}

		this.canvas.image(im);

		this.canvas.text(20, 20, '#3f3', this.kb.key);

		if(this.mouse.buttons) {
			this.canvas.circle(this.mouse.x, this.mouse.y, 10, 'lime');
			this.mouse.buttons = 0;
		}

		this.requestUpdate();
	}

	randomPixel()
	{
		return [
			Utils.random(200,255),
			Utils.random(50,200),
			Utils.random(50,100),
			255
		];
	}

}
