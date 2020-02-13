class NextGame {

	constructor()
	{
		this.mouse = null;
		this.kb = { key: ''};
		this.canvas = new NextCanvas('canvas');
		this.elapsedTime = 0;
		this.time = this.now();

		this.MB_LEFT = 1;
		this.MB_RIGHT = 2;
		this.MB_MIDDLE = 4;
	}

	init()
	{
		this.initKeyboard();
		this.initMouse();

		this.canvas.on('mousedown', e => this.getMouseButtons(e));
		this.canvas.on('mouseup', e => this.mouseUp(e));
		this.canvas.on('mousemove', e => this.getMousePos(e));
		$(window).bind('wheel', e => this.getWheel(e));

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

	initMouse()
	{
		this.mouse = {
			x: 0, y: 0, 
			buttons: 0, 
			deltaY: 0, 
			clickX: 0, clickY: 0, 
			offsetX: 0, offsetY: 0, 
			hold: 0,
			release: 0
		};
	}

	getMouseButtons(e)
	{
		this.mouse.buttons = e.buttons;
		this.mouse.clickX = this.mouse.x;
		this.mouse.clickY = this.mouse.y;
		this.mouse.hold = e.buttons;
	}

	mouseUp(e)
	{
		this.mouse.hold = 0;
		this.mouse.release = 1;
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
		
		m.x = Math.floor(e.offsetX * scaleX / this.canvas.scale);
		m.y = Math.floor(e.offsetY * scaleY / this.canvas.scale);

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
