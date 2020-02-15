class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(800);
		this.canvas.height(600);

		this.ship = new Shape(300, 300, [10, 0, -10, 10, -10, -10]);
	}

	update()
	{
		this.requestUpdate();

		this.canvas.clear();
		
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

		this.ship.angle = Math.atan2(this.mouse.y - this.ship.y, this.mouse.x - this.ship.x);
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

		this.angle = 1;
	}

	translate(nodes, x, y)
	{
		let output = [];
		for(let i = 0; i < nodes.length; i += 2) {
			output.push(nodes[i] + x);
			output.push(nodes[i+1] + y);
		}

		return output;
	}

	rotate(nodes, a)
	{
		let output = [];

		for(let i = 0; i < nodes.length; i += 2) {
			let x = this.nodes[i];
			let y = this.nodes[i+1];

			output.push(x * Math.cos(a) - y * Math.sin(a));
			output.push(x * Math.sin(a) + y * Math.cos(a));
		}

		return output;
	}


	update()
	{
		this.vx += -Math.sign(this.vx) * this.decel;
		this.vy += -Math.sign(this.vy) * this.decel;

		if (Math.abs(this.vx) < 0.1) this.vx = 0;
		if (Math.abs(this.vy) < 0.1) this.vy = 0;

		this.x += this.vx;
		this.y += this.vy;
	}

	draw(canvas)
	{
		this.x = Utils.clamp(this.x, 0, canvas.width());
		this.y = Utils.clamp(this.y, 0, canvas.height());

		let nodes = this.translate(this.rotate(this.nodes, this.angle), this.x, this.y);

		canvas.polygon(nodes, this.color);
	}
}