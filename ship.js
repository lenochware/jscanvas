class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(800);
		this.canvas.height(600);
	}

	update()
	{
		this.requestUpdate();

		this.canvas.clear();
		
		// if (this.kb.key == 'Escape') {
		// 	this.kb.key = '';
		// };

		//this.canvas.text(30, 30, 'red', JSON.stringify(this.mouse.clickX));


		if(this.mouse.buttons) {
			this.mouse.buttons = 0;
		}

		this.time = this.now();
	}
}


class Shape
{
	constructor()
	{
		this.nodes = [];
		this.color = 'red';
		this.maxNodes = 0;
	}

	draw(canvas)
	{
		throw Error('Abstract method.');
	}
}