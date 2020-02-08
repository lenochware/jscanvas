class Main extends NextGame {

	init()
	{
		super.init();
		//this.canvasImage = this.canvas.image();
		this.shapes = [];

		this.cursor = {x:0, y:0};
		this.gridSize = 10;

		let s = new Shape();
		s.nodes.push({x:50,y:50});
		this.shapes.push(s);
	}

	update()
	{
		this.requestUpdate();

		this.canvas.clear();

		let height = this.canvas.height();
		let width = this.canvas.width();
		for(let y = 0; y < height; y += this.gridSize) {
			for(let x = 0; x < width; x += this.gridSize) {
				this.canvas.pixel(x, y, '#006');
			}
		}



		for (let s of this.shapes) {
			s.draw(this.canvas);
		}

		this.cursor.x = Math.round(this.mouse.x / this.gridSize) * this.gridSize;
		this.cursor.y = Math.round(this.mouse.y / this.gridSize) * this.gridSize;
		this.canvas.pixel(this.cursor.x, this.cursor.y, 'red');

		if (this.kb.key == 'p') {
			this.paused = !this.paused;
			this.kb.key = '';
		}

		this.canvas.text(20, 20, '#3f3', this.kb.key);

		if(this.mouse.buttons) {
			this.canvas.circle(this.mouse.x, this.mouse.y, 10, 'lime');
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
	}

	draw(canvas)
	{
		for (let p of this.nodes) {
			canvas.pixel(p.x, p.y, 'green');
		}
	}
}