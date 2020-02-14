class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(800);
		this.canvas.height(600);

		this.ship = new Shape(300, 300, [0, -10, -10, 10, 10, 10]);
	}

	update()
	{
		this.requestUpdate();

		this.canvas.clear();
		
		// if (this.kb.key == 'Escape') {
		// 	this.kb.key = '';
		// };

		//this.canvas.text(30, 30, 'red', JSON.stringify(this.kbmap));

		if (this.kbmap['ArrowLeft']) {
			this.ship.vx -= 0.2;
		}

		if (this.kbmap['ArrowRight']) {
			this.ship.vx += 0.2;
		}

		if (this.kbmap['ArrowUp']) {
			this.ship.vy -= 0.2;
		}

		if (this.kbmap['ArrowDown']) {
			this.ship.vy += 0.2;
		}

		this.kb.key = '';


		this.ship.update();
		this.ship.draw(this.canvas);


		if(this.mouse.buttons) {
			this.mouse.buttons = 0;
		}

		this.time = this.now();
	}
}


class Shape
{
	constructor(x, y, nodes)
	{
		this.nodes = nodes;
		this.color = 'white';
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.decel = 0.1;

		this.angle = 0;
	}

	translate(x, y)
	{
		let output = [];
		for(let i = 0; i < this.nodes.length; i += 2) {
			output.push(this.nodes[i] + this.x);
			output.push(this.nodes[i+1] + this.y);
		}

		return output;
	}

	update()
	{
		this.vx += -Math.sign(this.vx) * this.decel;
		this.vy += -Math.sign(this.vy) * this.decel;

		this.x += this.vx;
		this.y += this.vy;
	}

	draw(canvas)
	{
		canvas.polygon(this.translate(this.x, this.y), this.color);
	}
}