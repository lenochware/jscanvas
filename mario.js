//Empty template

class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(400);
		this.canvas.height(300);
		this.frameCount = 0;

		let levelTiles = new Tileset(this, this.assets.tiles, 26, 24);

		this.level = new Level(levelTiles, [
			".....#.............................................",
			".....#.............................................",
			".....#.............................................",
			".....#.............................................",
			".....#.............................................",
			"...................................................",
			"...................................................",
			"..........................................?........",
			".........................................?.........",
			"......................$.$...............?..........",
			".....................$.$.$.............?...........",
			"...................WWWWWWWWWW.........?............",
			"...###...#.#.....................#?#...............",
			"...................................................",
			"..............#....................................",
			"###################################################",
		]);

		let playerAnim = new Anim(this, this.assets.player, 28, 1, {
			standLeft: [13, 1],
			standRight: [14, 1],
			runLeft: [1, 5],
			runRight: [22, 5],
			jumpLeft: [1, 1],
			jumpRight: [22, 1]
		});

		this.player = new Player(this, playerAnim, 5, 5);
	}

	preload()
	{
		this.loadImage('player', 'images/mario.png');	
		this.loadImage('tiles', 'images/mario-tiles.png');	
	}

	update()
	{
		this.requestUpdate();
		this.canvas.fill('lightblue');

		this.player.update();
		
		this.level.setPos(this.player.x - 10, this.player.y - 3);

		this.level.draw();
		this.player.draw();

		this.canvas.text(10, 10, 'white', this.player.x + ', ' + this.player.y);
		
		this.frameCount++;
	}
}


class Level
{
	constructor(tileSet, levelMap)
	{
		this.map = [];
		this.tileSet = tileSet;
		this.tileWidth = tileSet.tileWidth;
		this.tileHeight = tileSet.tileHeight;
		this.height = levelMap.length;
		for(let s of levelMap) {
			this.map.push(s.split(""));
		}
		this.width = this.map[0].length;
		this.view = {
			x: 0,
			y: 0,
			width: 30,
			height: 13
		}
	}

	setPos(x, y)
	{
		this.view.x = Utils.clamp(x, 0, this.width - this.view.width);
		this.view.y = Utils.clamp(y, 0, this.height - this.view.height);
	}

	get(x, y)
	{
		let tx = Math.floor(x);
		let ty = Math.floor(y);

		if (tx < 0 || ty < 0 || tx >= this.width || ty >= this.height) return 'x';

		return this.map[ty][tx];
	}

	set(x, y, c)
	{
		let tx = Math.floor(x);
		let ty = Math.floor(y);

		if (tx < 0 || ty < 0 || tx > this.width || ty > this.height) return null;

		this.map[ty][tx] = c;
	}

	draw()
	{
		let ti = {"#": 3, "?": 0, "$": 26, "W": 6};

		for(let y = 0; y < this.view.height + 1; y++) {
			for (let x = 0; x < this.view.width; x++)
			{
				let c = this.get(x + this.view.x, y + this.view.y);
				if (c == '.') continue;
				
				this.tileSet.draw(ti[c], 
					(x - this.view.x % 1) * this.tileSet.tileWidth, 
					(y - this.view.y % 1) * this.tileSet.tileHeight
				);
			}
		}
	}
}

class Player
{
	constructor(game, anim, x, y)
	{
		this.game = game;
		this.level = game.level;
		this.anim = anim;
		this.frame = 2;
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.width = this.anim.tileWidth;
		this.height = this.anim.tileHeight;
		this.jumping = false;
		this.facing = 1;
	}

	decel()
	{
		//friction
		this.vx = this.vx - Math.sign(this.vx) * 0.01;
		if (Math.abs(this.vx) < 0.01) this.vx = 0;

		//gravity
		this.vy += 0.01;
		this.vy = Utils.clamp(this.vy, -3, 3);

		if (Math.abs(this.vy) < 0.01) this.vy = 0;
			
		// if (!this.vx && Math.abs(this.x - Math.round(this.x)) < 0.126) this.x = Math.round(this.x);
		// if (!this.vy && Math.abs(this.y - Math.round(this.y)) < 0.126) this.y = Math.round(this.y);
	}

	update()
	{
		if (this.game.kbmap['ArrowLeft']) {
			this.vx -= 0.03;
			this.facing = -1;
		}

		if (this.game.kbmap['ArrowRight']) {
			this.vx += 0.03;
			this.facing = 1;
		}
	
		this.vx = Utils.clamp(this.vx, -.3, .3);

		
		//y
		if (this.game.kbmap['ArrowUp'] && !this.jumping) {
			this.jumping = true;
			this.vy -= 0.3;
		}

		let anim = '';

		if (this.jumping) {
			anim = (this.facing == 1)? 'jumpRight' : 'jumpLeft';
		}
		else if (this.vx == 0) {
			anim = (this.facing == 1)? 'standRight' : 'standLeft';
		}
		else {
			anim = (this.vx > 0)? 'runRight' : 'runLeft';
		}

		if (this.game.frameCount % 5 == 0) {
			this.anim.nextFrame();
		}

		if (this.anim.name != anim) this.anim.play(anim);

		this.decel();

		this.newX = this.x + this.vx;
		this.newY = this.y + this.vy;

		this.checkCollision(0, 0);
		this.checkCollision(.99, 0);
		this.checkCollision(0, .99);
		this.checkCollision(.99, .99);

		this.x = this.newX;
		this.y = this.newY;

		//fix floating point blur error
		this.x = Math.trunc(this.x * 16) / 16;
		this.y = Math.trunc(this.y * 16) / 16;
	}

	collect(x, y)
	{
		this.level.set(x, y, '.');
	}

	checkCollision(ax, ay)
	{
		let oX = this.x + ax;
		let oY = this.y + ay;
		let nX = this.x + this.vx + ax;
		let nY = this.y + this.vy + ay;

		let c = this.level.get(nX, oY);
		if (c != '.') {
			
			if (c == '$') {
				this.collect(nX, oY);
				return;
			}

			this.vx = 0;
			this.newX = Math.floor(oX);
		}

		nX = this.newX + ax;

		c = this.level.get(nX, nY);
		if (c != '.') {

			if (c == '$') {
				this.collect(nX, nY);
				return;
			}

			this.vy = 0;
			if (ay > 0) this.jumping = false;
			this.newY = Math.floor(oY);
		}
	}

	draw()
	{
		this.anim.draw(
			Math.floor((this.x - this.level.view.x) * this.level.tileWidth), 
			Math.floor((this.y - this.level.view.y) * this.level.tileHeight)
		);
	}
}

class Tileset
{
	constructor(game, asset, x, y)
	{
		this.canvas = game.canvas;
		this.image = asset.data;
		this.size = x * y;
		this.x = x;
		this.y = y;
		this.tileWidth = Math.floor(this.image.width / x);
		this.tileHeight = Math.floor(this.image.height / y);
	}

	draw(ti, dx, dy)
	{
		let sx = ti % this.x * this.tileWidth;
		let sy = Math.floor(ti / this.x) * this.tileHeight;
		this.canvas.context.drawImage(this.image, sx, sy, this.tileWidth, this.tileHeight, dx, dy, this.tileWidth, this.tileHeight);
	}
}

class Anim extends Tileset
{
	constructor(game, asset, x, y, clips)
	{
		super(game, asset, x, y);
		this.frame = 0;
		this.clips = clips;
		this.name = Object.keys(clips)[0];
	}

	play(name)
	{
		this.name = name;
		this.frame = 0;
	}

	nextFrame()
	{
		this.frame = (this.frame + 1) % this.clips[this.name][1];
	}

	draw(dx, dy)
	{
		super.draw(this.frame + this.clips[this.name][0], dx, dy);
	}
}