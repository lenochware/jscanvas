
class Main extends NextGame {

	init()
	{
		super.init();
		this.width = 800;
		this.height = 400;

		this.canvas.width(this.width);
		this.canvas.height(this.height);
		this.balls = new Group(this);

		for (let i = 0; i < 10; i++)
		{
			this.balls.add(new Ball(Utils.random(0, 600), Utils.random(0, 300), 20));
		}
		
		this.selected = null;
		this.force = null;
	}

	update()
	{
		this.requestUpdate();
		this.canvas.clear();

		this.balls.collides(this.balls);
		this.balls.draw();

		if (this.mouse.buttons) {
			this.selected = null;
			for (let ball of this.balls.members) {
				if (ball.collidesPoint(this.mouse.x, this.mouse.y)) {
					this.selected = ball;
					break;
				}
			}

			this.mouse.buttons = 0;
		}


		if (this.selected && this.mouse.hold == this.MB_LEFT) {

			if (this.kbmap['s']) {
				this.canvas.line(this.selected.x, this.selected.y, this.mouse.x, this.mouse.y, 'red');
				this.force = [(this.selected.x - this.mouse.x) / 10, (this.selected.y - this.mouse.y) / 10];
			}
			else {
				this.selected.x = this.mouse.x;
				this.selected.y = this.mouse.y;
			}

		}

		if (this.force && this.mouse.release)
		{
			this.selected.vx = this.force[0];
			this.selected.vy = this.force[1];
			this.selected.angle = Math.atan2(this.force[1], this.force[0]);
			this.force = null;
			this.mouse.release = 0;
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

	update(game) {}
	draw(canvas) {}

	collides(vobj)
	{
		if (this == vobj) return false;
		return ((vobj.x - this.x) ** 2 + (vobj.y - this.y) ** 2 <= (vobj.size + this.size) **2);
	}

	hit(source)
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

class Ball extends Vobj
{
	constructor(x, y, size)
	{
		super(x, y);
		this.size = size;
		this.angle = 0;
	}

	// static createModel()
	// {
	// 	Ball.model = [1,2,3,4];
	// }

	dist(x, y)
	{
		return Math.hypot(this.x - x, this.y - y);
	}

	hit(b2)
	{
		//Static collision
		let b1 = this;

		let d = b1.dist(b2.x, b2.y);
		let move = (d - b1.size - b2.size) / 2;

		b1.x -= (b1.x - b2.x) / d * move;
		b1.y -= (b1.y - b2.y) / d * move;

		b2.x += (b1.x - b2.x) / d * move;
		b2.y += (b1.y - b2.y) / d * move;

		//Dynamic collision

	

	}

	collidesPoint(x, y)
	{
		return this.collides({x, y, size: 0});
	}

	update(game)
	{
		if (this.x < 0) this.x = game.width;
		if (this.y < 0) this.y = game.height;

		if (this.x > game.width) this.x = 0;
		if (this.y > game.height) this.y = 0;

		if (Math.abs(this.vx + this.vy) < 0.1) {
			this.vx = 0;
			this.vy = 0;
		}

		this.ax = -0.02 * this.vx;
		this.ay = -0.02 * this.vy;

		this.vx += this.ax;
		this.vy += this.ay;
		this.x += this.vx;
		this.y += this.vy;
	}

	draw(canvas)
	{
		canvas.circle(this.x, this.y, this.size, this.color);
		canvas.line(this.x, this.y, 
			this.x + this.size * Math.cos(this.angle), 
			this.y + this.size * Math.sin(this.angle), 
		this.color);
	}

}
