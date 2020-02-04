class NextCanvas
{
	constructor(canvasId)
	{
		this.id = canvasId;
		this.element = document.getElementById(canvasId);
		this.context = this.element.getContext('2d');
		if (!this.context) throw Error('Canvas not found.');
	}

	//this.context.save();
	//this.context.restore();

	on(eventName, f)
	{
		$('#' + this.id).on(eventName, f);
	}

	clear()
	{
		this.context.clearRect(0, 0, this.width(), this.height());
		return this;
	}

	width()
	{
		return this.context.canvas.width;
	}

	height()
	{
		return this.context.canvas.height;
	}

	screenWidth()
	{
		let r = this.element.getBoundingClientRect();
		return r.width;
	}

	screenHeight()
	{
		let r = this.element.getBoundingClientRect();
		return r.height;
	}

	fill(style = '#000')
	{
		this.context.fillStyle = style;
		this.context.fillRect(0, 0, this.width(), this.height());
		return this;
	}

	image(im)
	{
		if (im) {
			this.context.putImageData(im, 0, 0);
		}
		else {
			return this.context.getImageData(0, 0, this.width(), this.height());
		}
	}

	setLine(width)
	{
		if (!width) {
			this.context.lineWidth = this.prevLineWidth;
		}

		this.prevLineWidth = this.context.lineWidth;
		this.context.lineWidth = width;
		//this.ctx.setLineDash(dash);
		return this;
	}

	rect(x, y, w, h, style, lineWidth = 1)
	{
		this.setLine(lineWidth);

		this.context.strokeStyle = style;
		this.context.beginPath();
		this.context.rect(x, y, w, h);
		this.context.stroke();

		this.setLine(null);

		return this;
	}

	rectf(x, y, w, h, style)
	{
		this.context.fillStyle = style;
		this.context.fillRect(x, y, w, h);
		return this;
	}

	pixel(x, y, color)
	{
		this.rectf(x, y, 1, 1, color);
		return this;
	}

	setFont(font)
	{
		this.context.font = font;
	}

	scale(x, y)
	{
		this.context.scale(x, y);
	}

	text(x, y, color, s)
	{
		this.context.fillStyle = color;
		this.context.fillText(s, x, y); 
	}

	ellipse(x, y, rx, ry, style, lineWidth = 1)
	{
		this.setLine(lineWidth);

		this.context.strokeStyle = style;
		this.context.beginPath();
		this.context.ellipse(x, y, rx, ry, 0, 0, Math.PI*2);
		this.context.closePath();
		this.context.stroke();

		this.setLine(null);

		return this;
	}

	ellipsef(x, y, rx, ry, style)
	{
		this.context.fillStyle = style;
		this.context.beginPath();
		this.context.ellipse(x, y, rx, ry, 0, 0, Math.PI*2);
		this.context.closePath();
		this.context.fill();

		return this;
	}

	circle(x, y, r, style, lineWidth = 1)
	{
		this.ellipse(x, y, r, r, style, lineWidth);
	}

	circlef(x, y, r, style)
	{
		this.ellipsef(x, y, r, r, style);
	}

	line(x1, y1, x2, y2, style, lineWidth = 1)
	{
		this.polyline([x1, y1, x2, y2], style, lineWidth);
	}

	polyline(points, style, lineWidth = 1)
	{
		this.setLine(lineWidth);

		this.context.strokeStyle = style;
		this.context.beginPath();
		this.context.moveTo(points[0], points[1]);

		for(let i = 2; i < points.length; i += 2) {
			this.context.lineTo(points[i], points[i + 1]);
		}

		this.context.stroke();

		this.setLine(null);

		return this;
	}

	polygon(points, style)
	{
		this.context.fillStyle = style;		
		this.context.beginPath();
		this.context.moveTo(points[0], points[1]);

		for(let i = 2; i < points.length; i += 2) {
			this.context.lineTo(points[i], points[i + 1]);
		}
	
		this.context.closePath();
		this.context.fill();

		return this;
	}

	spline(points, style, lineWidth = 1)
	{
		this.setLine(lineWidth);

		this.context.strokeStyle = style;
		this.context.beginPath();
		this.context.moveTo(points[0], points[1]);

		for (var i = 2; i < points.length - 4; i += 2)
		{
				var xc = (points[i] + points[i + 2]) / 2;
				var yc = (points[i + 1] + points[i + 3]) / 2;
				this.context.quadraticCurveTo(points[i], points[i + 1], xc, yc);
		}
		// curve through the last two points
		this.context.quadraticCurveTo(points[i], points[i+1], points[i+2], points[i+3]);

		//if (closed) this.context.closePath();

		this.context.stroke();
		this.setLine(null);

		return this;
	}	

}