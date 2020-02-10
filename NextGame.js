class NextGame {

	constructor()
	{
		this.mouse = {
			x: 0, y: 0, 
			buttons: 0, 
			deltaY: 0, 
			clickX: 0, clickY: 0, 
			offsetX: 0, offsetY: 0, 
			hold: false
		};

		this.kb = { key: ''};
		this.canvas = new NextCanvas('canvas');
		this.elapsedTime = 0;
		this.time = this.now();
	}

	init()
	{
		this.initKeyboard();
		this.canvas.on('mousedown', e => this.getMouseButtons(e));
		this.canvas.on('mouseup', e => this.mouseUp(e));
		this.canvas.on('mousemove', e => this.getMousePos(e));
		$(window).bind('wheel', e => this.getWheel(e));
		//this.canvas.on('mousewheel DOMMouseScroll', e => this.getWheel(e));
		this.requestUpdate();
	}

	now()
	{
		return Date.now();
	}

	initKeyboard()
	{
		$("body").on('keydown', (e) => {
			this.kb = e;
		});
	}

	getMouseButtons(e)
	{
		this.mouse.buttons = e.buttons;
		this.mouse.clickX = this.mouse.x;
		this.mouse.clickY = this.mouse.y;
		this.mouse.hold = true;
	}

	mouseUp(e)
	{
		this.mouse.hold = false;
	}

	getWheel(e)
	{
		this.mouse.deltaY = e.originalEvent.deltaY;
	}

	getMousePos(e)
	{
    let scaleX = this.canvas.width() / this.canvas.screenWidth();
    let scaleY = this.canvas.height() / this.canvas.screenHeight();
    let m = this.mouse;
		
		m.x = Math.floor(e.offsetX * scaleX);
		m.y = Math.floor(e.offsetY * scaleY);

		if (m.hold) {
			m.offsetX = m.x - m.clickX;
			m.offsetY = m.y - m.clickY;
		}
		else {
			m.offsetX = m.offsetY = 0;
		}
	}

	requestUpdate()
	{
		window.requestAnimationFrame(tm => {
			this.update();
		});
	}

	update()
	{
		this.time = this.now();
	}

}
