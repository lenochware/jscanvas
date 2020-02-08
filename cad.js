class Main extends NextGame {

	init()
	{
		super.init();
		this.canvas.width(800);
		this.canvas.height(600);

		this.shapes = [];

		this.selectedNode = null;

		this.gridSize = 10;
	}

	findNode(pos)
	{
		for(let shape of this.shapes)
		{
			let node = shape.findNode(pos);
			if (node) return node;
		}

		return null;
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

		let cursor = {};
		cursor.x = Math.round(this.mouse.x / this.gridSize) * this.gridSize;
		cursor.y = Math.round(this.mouse.y / this.gridSize) * this.gridSize;
		this.canvas.circle(cursor.x, cursor.y, 2, 'purple');

		if (this.kb.key == 'l') {
			let line = new Line;
			line.getNode(cursor);
			this.selectedNode = line.getNode(cursor);
			this.shapes.push(line);
			this.kb.key = '';
		}

		if (this.kb.key == 'c') {
			let line = new Circle;
			line.getNode(cursor);
			this.selectedNode = line.getNode(cursor);
			this.shapes.push(line);
			this.kb.key = '';
		}		

		if (this.selectedNode) {
			this.selectedNode.x = cursor.x;
			this.selectedNode.y = cursor.y;
		}


		if(this.mouse.buttons) {
			if (this.selectedNode) {
				this.selectedNode.shape.color = 'green';
				this.selectedNode = null;
			}
			else {
				this.selectedNode = this.findNode(cursor);
				if (this.selectedNode) this.selectedNode.shape.color = 'red';
			}

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

	getNode(pos)
	{
		if (this.nodes.length >= this.maxNodes) return null;
		let node = { shape: this, x: pos.x, y: pos.y	};
		this.nodes.push(node);
		return node;
	}

	findNode(pos)
	{
		for(let node of this.nodes)
		{
			if (node.x == pos.x && node.y == pos.y) return node;
		}

		return null;
	}


	drawNodes(canvas)
	{
		for (let node of this.nodes)
		{
			canvas.circlef(node.x, node.y, 2, '#9f9');
		}
	}

	draw(canvas)
	{
		throw Error('Abstract method.');
	}
}

class Line extends Shape
{
	constructor()
	{
		super();
		this.maxNodes = 2;
	}

	draw(canvas)
	{
		let p1 = this.nodes[0];
		let p2 = this.nodes[1];
		canvas.line(p1.x, p1.y, p2.x, p2.y, this.color);
		this.drawNodes(canvas);
	}

}

class Circle extends Shape
{
	constructor()
	{
		super();
		this.maxNodes = 2;
	}

	draw(canvas)
	{
		let p1 = this.nodes[0];
		let p2 = this.nodes[1];
		canvas.circle(p1.x, p1.y, Math.hypot(p2.x - p1.x, p2.y - p1.y) , this.color);
		this.drawNodes(canvas);
	}

}