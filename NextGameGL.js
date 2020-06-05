class NextGameGL {

	constructor()
	{
		this.scene = null;
		this.camera = null;
		this.renderer = null;
		this.canvas = null;

		this.mouse = null;
		this.kb = { key: ''};
		this.kbmap = {};
		this.elapsedTime = 0;
		this.time = this.now();

		this.MB_LEFT = 1;
		this.MB_RIGHT = 2;
		this.MB_MIDDLE = 4;
	}

	start()
	{
		this.init();
	}

	init()
	{
		this.initKeyboard();
		this.initMouse();
		this.initThreeJs();

		$(this.canvas).on('mousedown', e => this.getMouseButtons(e));
		$(this.canvas).on('mouseup', e => this.mouseUp(e));
		$(this.canvas).on('mousemove', e => this.getMousePos(e));
		$(window).bind('wheel', e => this.getWheel(e));

		this.requestUpdate();
	}

	now()
	{
		return Date.now();
	}

	initThreeJs()
	{
		this.scene = new THREE.Scene();
		
		this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.camera.position.z = 5;

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.canvas = this.renderer.domElement;
		document.body.appendChild( this.canvas );
	}

	initKeyboard()
	{
		$("body").on('keydown', (e) => {
			this.kb = e;
			this.kbmap[e.keyCode] = true;
		});


		$("body").on('keyup keydown', (e) => {
			this.kbmap[e.key] = e.type == 'keydown';
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
    let scaleX = this.canvas.width / window.innerWidth;
    let scaleY = this.canvas.height / window.innerHeight;
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
