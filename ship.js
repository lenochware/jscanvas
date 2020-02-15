class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(800);
		this.canvas.height(600);

		this.ship = new Shape(300, 300, [10, 0, -10, 10, -10, -10]);
		this.particles = new Particles(this.canvas);
		this.enemies = new Particles(this.canvas);

		this.enemies.add(new Enemy(50,50, 1, 1, 'white'));
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
		this.particles.update();
		this.enemies.update();

		if(this.mouse.buttons) {
			this.particles.add(new Particle(this.ship.x, this.ship.y, 5, this.ship.angle, 'red'));
			this.mouse.buttons = 0;
		}

		this.time = this.now();
	}
}

class Particle
{
	constructor(x, y, v, angle, color)
	{
		this.color = color;
		this.x = x;
		this.y = y;
		this.dx = Math.cos(angle);
		this.dy = Math.sin(angle);
		this.decel = 0;
		this.v = v;
		this.dead = false;
	}

	update()
	{
		if (this.dead) return;
		this.x += this.dx * this.v;
		this.y += this.dy * this.v;

	}

	draw(canvas)
	{
		if (this.dead) return;
		canvas.rectf(this.x, this.y, 5, 5, this.color);

		if (this.x < 0 || this.y < 0 || this.x > canvas.width() || this.y > canvas.height()) {
			this.dead = true;
		}
	}
}

class Enemy extends Particle
{
	draw(canvas)
	{
		if (this.dead) return;
		canvas.rect(this.x, this.y, 40, 40, this.color);

		if (this.x < 0 ||  this.x > canvas.width()) this.dx *= -1;
		if (this.y < 0 || this.y > canvas.height()) this.dy *= -1;
	}

}

class Particles
{
	constructor(canvas)
	{
		this.data = [];
		this.canvas = canvas;
		this.deadCount = 0;
	}

	update()
	{
		for(let p of this.data) {
			if (p.dead) continue;
			p.update();
			p.draw(this.canvas);
			if (p.dead) this.deadCount++;
		}

		if (this.data.length > 10 && this.deadCount > 5) {
			this.cleanUp();
		}
	}

	cleanUp()
	{
		this.data = this.data.filter(p => p.dead == false);
		console.log('cleanUp', this.data.length);
	}

	add(p)
	{
		this.data.push(p);
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