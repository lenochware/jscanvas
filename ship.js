class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(800);
		this.canvas.height(600);

		this.ship = new Ship(this, 300, 300, [10, 0, -10, 10, -10, -10]);

		this.spaceObjects = new Group(this);
		this.particles = new Group(this);

		this.spaceObjects.add(this.ship);
		
		let mob = new Enemy(this, 100, 100, []);
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

		this.spaceObjects.draw();
		this.particles.draw();

		this.spaceObjects.collides(this.particles);
		this.spaceObjects.collides(this.spaceObjects);

		if(this.mouse.buttons) {
			this.ship.fire();
			this.mouse.buttons = 0;
		}

		this.time = this.now();
	}
}

class Vobj
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;

		this.vx = 0;
		this.vy = 0;
		this.ax = 0;
		this.ay = 0;
		
		this.color = 'white';
		this.size = 5;
		this.dead = false;
	}

	update(game)
	{
		if (this.dead) return;

		this.vx += this.ax;
		this.vy += this.ay;
		this.x += this.vx;
		this.y += this.vy;
	}

	draw(canvas) {}

	collides(vobj)
	{
		if (this == vobj) return false;
		return ((vobj.x - this.x) ** 2 + (vobj.y - this.y) ** 2 <= (vobj.size + this.size) **2);
	}

	hit(vobj)
	{
		this.dead = true;
	}

	outOfScreen(canvas)
	{
		if (this.x < 0 || this.x > canvas.width()) return 1;
		if (this.y < 0 || this.y > canvas.height()) return 2;
		return 0;
	}

	setVelocity(size, angle)
	{
		this.vx = size * Math.cos(angle);
		this.vy = size * Math.sin(angle);
	}

}

class Group
{
	constructor(game)
	{
		this.game = game;
		this.members = [];
		this.deadCount = 0;
	}

	draw()
	{
		for(let m of this.members) {
			if (m.dead) continue;
			m.update(this.game);
			m.draw(this.game.canvas);
			if (m.dead) this.deadCount++;
		}

		if (this.members.length > 10 && this.deadCount > 5) {
			this.cleanUp();
		}
	}

	collides(group)
	{
		for(let m of this.members) {
			for(let n of group.members) {
				if (m.dead || n.dead) continue;
				if (m.collides(n)) {
					m.hit(n);
					n.hit(m);
				}
			}
		}
	}

	cleanUp()
	{
		this.members = this.members.filter(p => !p.dead);
		console.log('cleanUp', this.members.length);
	}

	add(m)
	{
		this.members.push(m);
	}
}

class Bullet extends Vobj
{
	update(game)
	{
		super.update(game);
		if (this.outOfScreen(game.canvas)) this.dead = true;
	}

	draw(canvas)
	{
		canvas.rectf(this.x, this.y, this.size, this.size, this.color);
	}
}

class Sprite extends Vobj
{

	constructor(game, x, y, nodes)
	{
		super(x, y);
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

	draw(canvas)
	{
		this.x = Utils.clamp(this.x, 0, canvas.width());
		this.y = Utils.clamp(this.y, 0, canvas.height());

		let nodes = this.translate(this.rotate(this.nodes, this.angle), this.x, this.y);

		canvas.polygon(nodes, this.color);
	}
}

class Ship extends Sprite
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
		let p = new Bullet(this.x, this.y);
		p.setVelocity(5, this.angle);

		p.x += 4 * p.vx;
		p.y += 4 * p.vy;
		p.color = 'red';

		this.game.particles.add(p);
	}

	hit(vobj)
	{
		this.color = 'red';
		setTimeout( () => this.color = 'white', 200);
	}	

	update(game)
	{
		this.vx += -Math.sign(this.vx) * this.decel;
		this.vy += -Math.sign(this.vy) * this.decel;

		let off = this.outOfScreen(game.canvas);

		if (off == 1) this.vx *= -1;
		if (off == 2) this.vy *= -1;

		this.x += this.vx;
		this.y += this.vy;
	}
}

class Enemy extends Sprite
{

	constructor(sprite, x, y, nodes)
	{
		super(sprite, x, y, nodes);
		this.size = 20;
	}

	update(game)
	{
		let off = this.outOfScreen(game.canvas);

		if (off == 1) this.vx *= -1;
		if (off == 2) this.vy *= -1;

		this.x += this.vx;
		this.y += this.vy;
	}

	hit(vobj)
	{
		this.color = 'red';
		setTimeout( () => this.color = 'white', 200);

		if (vobj instanceof Bullet) this.dead = true;
	}		

	draw(canvas)
	{
		canvas.rect(this.x - 20, this.y -20, 40, 40, this.color);
	}

}

