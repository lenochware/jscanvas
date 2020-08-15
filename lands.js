class Main extends NextGameGL {

	init()
	{
		super.init();
		//this.fullScreen();

		$('canvas').on('contextmenu', function(e){ return false; });

		this.raycaster = new THREE.Raycaster();
		this.selected = 0;
		this.level = new Level(10, 10);

		//this.setOrtho(20, 10);

		// (left, up, backward)
		this.camera.position.set(0, 4, 10);
		this.camera.lookAt(0, 0, 0);
		this.camera.rotation.order = "YXZ";

		const textureLoader = new THREE.TextureLoader();
		this.texture = textureLoader.load( 'images/dg_features32.gif' );
		this.texture.magFilter = THREE.NearestFilter;
		this.texture.minFilter = THREE.NearestFilter;
		//this.texture.anisotropy = 16;

		this.box = this.createBox();
		this.material = new THREE.MeshLambertMaterial( { map: this.texture, color: '#FFFFFF' } );

		this.cells = {
			rock:  {texture: 2*9, energy: 1},
			earth: {texture: 9*9+3, energy: 1},
			water: {texture: 7*9+3, energy: 1},
			grass: {texture: 7*9, energy: 1},
			flower: {texture: 8*9, energy: 2},
			tree: {texture: 8*9+3, energy: 2}
		}

		
		this.xtab = {
			//'rock x rock': 'earth',
			'rock,water': 'earth',
			'earth,water': 'grass',
			'grass,grass': 'flower',
			'flower,water': 'tree',
		}

		this.createScene();
	}

	setTexture(m, idx)
	{
		 let w = 9;
		 let h = 13;

		 let u = idx % w / w;
		 let v = Math.floor(idx / w) / h;

		 let face = m.geometry.faceVertexUvs[0];
		 face[0][0].set(u, v);
		 face[0][1].set(u + 1/w, v + 1/h);
		 face[0][2].set(u, v + 1/h);
		 face[1][0].set(u, v);
		 face[1][1].set(u + 1/w, v);
		 face[1][2].set(u + 1/w, v + 1/h);

		 m.geometry.uvsNeedUpdate = true;

		 //this.level[m.name] = {tex: idx};

	}

	createScene()
	{
		this.scene = new THREE.Scene();
		let lev = this.level;


		for(let pos = 0; pos < lev.width * lev.height; pos++)
		{
			let cell = lev.get(pos);
			let m = new THREE.Mesh(this.box.ny.clone(), this.material);
			m.position.set(cell.x - lev.width/2, 0, cell.y - lev.height/2);
			m.name = pos;
			this.setTexture(m, this.cells[cell.id].texture);
			this.scene.add(m);
		}

		this.scene.add( new THREE.AmbientLight(0xffffff) );
	}

	update()
	{
		this.requestUpdate();
			
		// if (!this.isPointerLock()) {
		// 	this.renderer.render( this.scene, this.camera );
		// 	return;
		// }

		if (this.kb.key.match(/\d/)) {
			let texture = [2*9, 7*9, 7*9+3, 9*9+3, 6*9+3, 11*9,  12*9+3, 5*9+1, 9+3, 8*9+3];
			console.log(Number(this.kb.key));
			this.selected = texture[Number(this.kb.key)];
			this.kb.key = '';
		}

		if (this.kbmap['ArrowUp']) {
			this.scene.rotation.x += 0.05;
		}

		if (this.kbmap['ArrowDown']) {
			this.scene.rotation.x -= 0.05;
		}

		if (this.kbmap['ArrowLeft']) {
			this.scene.rotation.y += 0.05;
		}

		if (this.kbmap['ArrowRight']) {
			this.scene.rotation.y -= 0.05;
		}

		// key '/' repeats ad infimum?
		if (this.kbmap['z']) {
			this.camera.zoom += 0.05;
			this.camera.updateProjectionMatrix();
		}

		if (this.kbmap['Z']/* && this.kbmap['Shift']*/) {
			this.camera.zoom -= 0.05;
			this.camera.updateProjectionMatrix();
		}

		if (this.kb.key == 's') {
			localStorage.setItem('lands01', JSON.stringify(this.level));
			this.debugText('Level saved.');
		}

		if (this.kbmap['l']) {
			this.level = JSON.parse(localStorage.getItem('lands01'));
			this.debugText('Level loaded.');
			this.createScene();
		}

		if (this.mouse.buttons == this.MB_LEFT)
		{
			let obj = this.mousePickObj();
			if (obj) {
				this.debugText(obj.name);
				this.setTexture(obj, this.selected);
				this.level.set(obj.name + 0, this.selected, 20);
			}
		}

		if (this.mouse.buttons == this.MB_RIGHT)
		{
		}

		this.renderer.render( this.scene, this.camera );
		this.mouse.buttons = 0;
		this.kb.key = '';
	}

	mousePickObj()
	{
		let mousePos = {
			x : this.mouse.x / this.canvas.width * 2 - 1, 
			y: this.mouse.y / this.canvas.height * -2 + 1
		};

		this.raycaster.setFromCamera(mousePos, this.camera);
		// get the list of objects the ray intersected
		const intersectedObjects = this.raycaster.intersectObjects(this.scene.children);
		if (intersectedObjects.length) {
			return intersectedObjects[0].object;
		}
		else return null;
	}

	createPlane()
	{
		const geometry = new THREE.Geometry();
		geometry.vertices.push(
			new THREE.Vector3(-.5, -.5,  0),
			new THREE.Vector3( .5, -.5,  0),
			new THREE.Vector3(-.5,  .5,  0),
			new THREE.Vector3( .5,  .5,  0)
		);

		geometry.faces.push(
			new THREE.Face3(0, 3, 2),
			new THREE.Face3(0, 1, 3)
		);

		// geometry.faces[0].color =  new THREE.Color('red');
		// geometry.faces[1].color =  new THREE.Color('yellow');

		// geometry.faces[0].vertexColors = [
	 //    (new THREE.Color()).setHSL(0  , 1, 0.5),
	 //    (new THREE.Color()).setHSL(0.1, 1, 0.5),
	 //    (new THREE.Color()).setHSL(0.2, 1, 0.5),
	 //  ];

		geometry.faceVertexUvs[0].push(
			[ new THREE.Vector2(0, 0), new THREE.Vector2(0, 0), new THREE.Vector2(0, 0) ],
			[ new THREE.Vector2(0, 0), new THREE.Vector2(0, 0), new THREE.Vector2(0, 0) ],
		);
	 
		return geometry;
	}

	createBox()
	{
		let box = {};

		box.px = this.createPlane();
		box.px.rotateY( Math.PI / 2 );
		box.px.translate( 0.5, 0, 0 );

		box.nx = this.createPlane();
		box.nx.rotateY( - Math.PI / 2 );
		box.nx.translate( -0.5, 0, 0 );

		box.py = this.createPlane();
		box.py.rotateX( - Math.PI / 2 );
		box.py.translate( 0, 0.5, 0 );

		box.ny = this.createPlane();
		// box.ny.rotateX( Math.PI / 2 );
		box.ny.rotateX( - Math.PI / 2 );
		box.ny.translate( 0, -0.5, 0 );

		box.pz = this.createPlane();
		box.pz.translate( 0, 0, 0.5 );

		box.nz = this.createPlane();
		box.nz.rotateY( Math.PI );
		box.nz.translate( 0, 0, -0.5 );		

		return box;
	}	

}

class Level
{
	constructor(w, h)
	{
		this.cells = [];	
		this.create(w, h);
	}

	vec2(pos) {
		return {x: pos % this.width, y: pos / this.width | 0};
	}

	get()
	{
		let pos, v;

		if (arguments.length == 1) {
			pos = arguments[0];
			v = this.vec2(pos);
		}
		else {
			v = {x: arguments[0], y: arguments[1]};
			pos = v.y * this.width + v.x;
		}

		if (v.x < 0 || v.x >= this.width || v.y < 0 || v.y > this.height) return null;

		return this.cells[pos];
	}

	set(pos, id, energy, spread = 0)
	{
		let v = this.vec2(pos);
		return this.cells[pos] = {x: v.x, y: v.y, id, energy, spread};
	}

	push(pos, energy)
	{
		let c1 = this.get(pos);
		let c2 = this.getNeighbour(pos);

		let cellEnergy = c1.energy + energy;
		if (cellEnergy < 0 /*|| cellEnergy > MAX_ENERGY */) return false;

		//spread a mix jen kdyz energie neni zaporna.
		//mixTable t1 x t2, tabulka id,energy -> textura

		if (energy > 1) {
			let id = this.mix(c1, c2);
			let spread = cellEnergy;
		}
		else {
			let id = c1.id;
			let spread = 0;
		}

		this.set(pos, id, cellEnergy, spread);
		return true;
	}

	mix(c1, c2)
	{
		return this.game.xtab[Utils.key(c1.id, c2.id)] || c1.id;
	}

	getNeighbour(pos)
	{
		let cells = {};
		let v = this.vec2(pos);

		function add(c) {
			if (c && cells[c.id]) cells[c.id] += c.energy;
			else if (c) cells[c.id] = c.energy;			
		}

		add(this.get(v.x - 1, v.y));
		add(this.get(v.x + 1, v.y));
		add(this.get(v.x, v.y - 1));
		add(this.get(v.x, v.y + 1));

		return cells;
	}

	getMaxNeighbour(pos)
	{
		let cells = this.getNeighbour(pos);
		let maxCells = [];
		let max = Math.max(...Object.values(cells));
		for (const [id, energy] of Object.entries(cells)) {
		  if (energy != max) continue;
		  maxCells.push({id, energy})
		}

		return maxCells[Math.floor(Math.random() * maxCells.length)];
	}

	spread(pos)
	{}

	create(w,h)
	{
		this.width = w;
		this.height = h;

		for(let pos = 0; pos < w * h; pos++) {
			this.cells.push({
				x: pos % w,
				y: pos / w | 0,
				id: (pos % this.width == Math.floor(pos / this.width))? 'water' : 'rock',
				energy: 1,
				spread: 0
			});
		}
	}

	update()
	{
		for(let pos = 0; pos < this.cells.length; pos++) {
			if (this.get(pos).spread > 0 && Math.random() < .3) this.spread(pos);
		}

	}

}