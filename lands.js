class Main extends NextGameGL {

	init()
	{
		super.init();
		//this.fullScreen();

		$('canvas').on('contextmenu', function(e){ return false; });

		this.raycaster = new THREE.Raycaster();
		this.selected = '';
		this.level = new Level(this, 10, 10);

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
			growing: {texture: 8,   energy: 0},
			rock:  {texture: 2*9,   energy: 0},
			earth: {texture: 9*9+3, energy: 0},
			water: {texture: 7*9+3, energy: 8, spread: 'grass'},
			grass: {texture: 7*9,   energy: 1, base: 'earth' },
			tree:  {texture: 8*9+3, energy: 8},
			flower: {texture: 8*9,  energy: 2},
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
		this.level.update();
		
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

		if (this.mouse.buttons)
		{
			let obj = this.mousePickObj();
			if (obj) {
				let pos = obj.name + 0;
				if (this.mouse.buttons == this.MB_LEFT) {
					this.level.push(pos);
				}
				else {
					this.level.pop(pos);
				}

				let c = this.level.get(pos);
				let texture = this.cells[ c.growing? 'growing' : c.id].texture;

				this.setTexture(obj, texture);
			}
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
	constructor(game, w, h)
	{
		this.game = game;
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

	// set(pos, id, energy, spread = 0)
	// {
	// 	let v = this.vec2(pos);
	// 	return this.cells[pos] = {x: v.x, y: v.y, id, energy, spread};
	// }

  push(pos)
  {
  	if (!this.game.selected) return false;
  	let c = this.get(pos);
  	let t = this.getType(c.id);
  	if (t.energy != 0) return false;

  	if (c.owner == 1 || this.isBorder(pos))
  	{
	  	c.id = this.game.selected;
	  	t = this.getType(c.id);
	  	c.owner = 1;
	  	c.growing = true;
	  	c.time = this.game.time(t.energy);
	  	this.game.selected = '';
	  	this.game.debugText(' --- ' + pos);

  		return true;
  	};

  	return false;
  }

	pop(pos)
	{
		let c = this.get(pos);
		if (this.game.selected || this.getType(c.id).energy == 0 || c.growing) return false;
		if (c.owner == 0 && this.isBorder(pos)) c.owner = 1;
		if (c.owner != 1) return false;

		this.game.selected = c.id;
		c.id = 'earth';

		this.game.debugText(this.game.selected);
		return true;
	}

	getNeighbour(pos)
	{
		let cells = [];
		let v = this.vec2(pos);

		function add(c) {
			if (c) cells.push(c);
		}

		add(this.get(v.x - 1, v.y));
		add(this.get(v.x + 1, v.y));
		add(this.get(v.x, v.y - 1));
		add(this.get(v.x, v.y + 1));

		return cells;
	}

	getType(id)
	{
		return this.game.cells[id];
	}

	isBorder(pos)
	{
  	for(let cell of this.getNeighbour(pos)) {
  		if (cell.owner == 1) return true;
  	}

  	return false;
	}

	create(w,h)
	{
		this.width = w;
		this.height = h;

		for(let pos = 0; pos < w * h; pos++) {
			let v = this.vec2(pos);
			this.cells.push({
				x: v.x,
				y: v.y,
				id: (v.x < 4 && v.y > 6)? 'earth' : 'rock',
				owner: (v.x < 4 && v.y > 6)? 1 : 0,
				time: 0,
				growing: false
			});
		}

		this.cells[9*w+1].id = 'grass';
		this.cells[9*w+2].id = 'water';
		this.cells[4*w+3].id = 'tree';
	}

	spread(pos, c, t)
	{
		c.time = this.game.time(Utils.random(5,35));

		let cells = this.getNeighbour(pos).filter( c => this.getType(c.id).energy == 0);

		//console.log(this.getNeighbour(pos));

		if (cells.length == 0) return false;
	
		let nc = cells[Math.floor(Math.random() * cells.length)];
		let nct = this.getType(t.spread);

		nc.id = t.spread;
		nc.energy = nct.energy;
		this.setTexture(nc.y * this.width + nc.x, nct.texture);
	}

	grows(pos, c, t)
	{
		this.setTexture(pos, t.texture);
		c.growing = false;
		c.time = 0;
	}

	setTexture(pos, texture)
	{
		let obj = this.game.scene.getObjectByName(pos);
		this.game.setTexture(obj, texture);
	}

	update()
	{
		for(let pos = 0; pos < this.cells.length; pos++) {
			let c = this.get(pos);
			let t = this.getType(c.id);

			if (c.growing && this.game.time() > c.time) {
				this.grows(pos, c, t);
			}

			if (!c.growing && t.spread) {
				if (!c.time) c.time = this.game.time(Utils.random(5,35));
				if (this.game.time() > c.time) this.spread(pos, c, t);
			}
		}

	}

}