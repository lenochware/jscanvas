class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(800);
		this.canvas.height(600);

		this.ship = new Ship(this, 300, 300, [10, 0, -10, 10, -10, -10]);

		this.spaceObjects = new Group();
		this.particles = new Group();

		this.spaceObjects.add(this.ship);
		
		let mob = new Enemy(this.canvas, 100, 100);
		mob.setVelocity(1,3);
		this.spaceObjects.add(mob);
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

		this.spaceObjects.update();
		this.particles.update();

		this.spaceObjects.collides(this.particles);
		this.spaceObjects.collides(this.spaceObjects);

		if(this.mouse.buttons) {
			this.ship.fire();
			this.mouse.buttons = 0;
		}

		this.time = this.now();
	}
}

class Particle
{
	constructor(canvas, x, y)
	{
		this.canvas = canvas;
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.ax = 0;
		this.ay = 0;
		this.color = 'white';
		this.size = 5;
		this.alive = true;
	}

	setVelocity(size, angle)
	{
		this.vx = size * Math.cos(angle);
		this.vy = size * Math.sin(angle);
	}

	update()
	{
		if (this.outOfScreen()) this.alive = false;
		if (!this.alive) return;

		this.vx += this.ax;
		this.vy += this.ay;
		this.x += this.vx;
		this.y += this.vy;

		this.draw();
	}

	collides(mob)
	{
		if (this == mob) return false;
		return ((mob.x - this.x) ** 2 + (mob.y - this.y) ** 2 <= (mob.size + this.size) **2);
	}

	outOfScreen()
	{
		if (this.x < 0 ||  this.x > this.canvas.width()) return 1;
		if (this.y < 0 || this.y > this.canvas.height()) return 2;
		return 0;
	}

	hit(source)
	{
		this.alive = false;
	}

	draw()
	{
		this.canvas.rectf(this.x, this.y, this.size, this.size, this.color);
	}
}

class Mob extends Particle
{

	constructor(game, x, y, nodes)
	{
		super(game.canvas,x, y);
		this.game = game;
		this.nodes = nodes;
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

	draw()
	{
		this.x = Utils.clamp(this.x, 0, this.canvas.width());
		this.y = Utils.clamp(this.y, 0, this.canvas.height());

		let nodes = this.translate(this.rotate(this.nodes, this.angle), this.x, this.y);

		this.canvas.polygon(nodes, this.color);
	}	
}

class Ship extends Mob
{
	constructor(game, x, y, nodes)
	{
		super(game, x, y, nodes);
		this.decel = 0.1;
		this.angle = 1;
		this.size = 15;
	}

	fire()
	{
		let p = new Particle(this.canvas, this.x, this.y);
		p.setVelocity(5, this.angle);
		p.x += 4*p.vx;
		p.y += 4*p.vy;
		p.color = 'red';
		this.game.particles.add(p);

	}

	update()
	{
		this.vx += -Math.sign(this.vx) * this.decel;
		this.vy += -Math.sign(this.vy) * this.decel;

		let off = this.outOfScreen();
		if (off == 1) this.vx *= -1;
		if (off == 2) this.vy *= -1;

		this.x += this.vx;
		this.y += this.vy;

		this.draw();
	}
}

class Enemy extends Particle
{

	constructor(canvas, x, y, nodes)
	{
		super(canvas,x, y);
		this.size = 20;
	}

	update()
	{
		let off = this.outOfScreen();
		if (off == 1) this.vx *= -1;
		if (off == 2) this.vy *= -1;

		this.x += this.vx;
		this.y += this.vy;

		this.draw();
	}

	draw()
	{
		this.canvas.rect(this.x - 20, this.y -20, 40, 40, this.color);
	}

}

class Group
{
	constructor()
	{
		this.members = [];
		this.deadCount = 0;
	}

	update()
	{
		for(let m of this.members) {
			if (!m.alive) continue;
			m.update();
			if (!m.alive) this.deadCount++;
		}

		if (this.members.length > 10 && this.deadCount > 5) {
			this.cleanUp();
		}
	}

	collides(group)
	{
		for(let m of this.members) {
			for(let n of group.members) {
				if (!m.alive || !n.alive) continue;
				if (m.collides(n)) {
					m.hit(n);
					n.hit(m);
				}
			}
		}
	}

	cleanUp()
	{
		this.members = this.members.filter(p => p.alive);
		console.log('cleanUp', this.members.length);
	}

	add(m)
	{
		this.members.push(m);
	}
}