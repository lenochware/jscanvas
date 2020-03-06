
class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(800);
		this.canvas.height(600);
		this.balls = new Group(this);
		this.balls.add(new Ball(100,100,20));
		this.balls.add(new Ball(300,100,20));
		this.selected = null;
	}

	update()
	{
		this.requestUpdate();
		this.canvas.clear();

		this.balls.collides(this.balls);
		this.balls.draw();

		if (this.kb.key == 'SomeKey') {
			this.kb.key = '';
		};

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


		if (this.mouse.hold == this.MB_LEFT && this.selected) {
			this.selected.x = this.mouse.x;
			this.selected.y = this.mouse.y;
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
	}

	// static createModel()
	// {
	// 	Ball.model = [1,2,3,4];
	// }

	dist(x, y)
	{
		return Math.hypot(this.x - x, this.y - y);
	}

	hit(ball)
	{
		let d = this.dist(ball.x, ball.y);
		let move = (this.size + ball.size - d) / 2;

		this.x = this.x + (this.x - ball.x) / d * move;
		this.y = this.y + (this.y - ball.y) / d * move;

		ball.x = ball.x - (this.x - ball.x) / d * move;
		ball.y = ball.y - (this.y - ball.y) / d * move;

	}

	collidesPoint(x, y)
	{
		return this.collides({x, y, size: 0});
	}

	update(game)
	{
		if (this.outOfScreen(game.canvas)) this.dead = true;
		if (this.dead) return;

		this.vx += this.ax;
		this.vy += this.ay;
		this.x += this.vx;
		this.y += this.vy;
	}

	draw(canvas)
	{
		canvas.circle(this.x, this.y, this.size, this.color);
	}

}
