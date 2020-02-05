class NextGame {

	constructor()
	{
		this.mouse = {x: 0, y: 0, buttons: 0};
		this.kb = { key: ''};
		this.canvas = new NextCanvas('canvas');
		this.elapsedTime = 0;
		this.time = this.now();
	}

	init()
	{
		this.initKeyboard();
		this.canvas.on('mousedown', e => this.getMouseButtons(e));
		this.canvas.on('mousemove', e => this.getMousePos(e));
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
		let b = [1,2,4];
		this.mouse.buttons = b[e.button];
	}

	getMousePos(e)
	{
    let scaleX = this.canvas.width() / this.canvas.screenWidth();
    let scaleY = this.canvas.height() / this.canvas.screenHeight();
		
		this.mouse.x = Math.floor(e.offsetX * scaleX);
		this.mouse.y = Math.floor(e.offsetY * scaleY);
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
