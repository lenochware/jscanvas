const CHUNK_SIZE = 22;
const HEIGHT_MAX = 12;
const HEIGHT_MIN = -4;

class Main extends NextGameGL {

	init()
	{
		super.init();

		this.cpos = {x:0, z:0};
		this.chunks = {};
		this.assets = {}

		const loader = new THREE.TextureLoader();

		this.assets.basicMaterial = new THREE.MeshLambertMaterial({color:'#3f3'});

		let all = loader.load('images/all.png');
		all.magFilter = THREE.NearestFilter;
		this.assets.boxMaterial = new THREE.MeshLambertMaterial({ map: all });

		this.createScene();
		this.addLights();

		let that = this;
		this.canvas.onclick = function() {
		  that.canvas.requestPointerLock();
		};

		window.onresize = function() {
			that.windowResize();
		}
	}

	createScene()
	{
		this.scene.background = new THREE.Color( 0x8cc4fe );
		this.scene.fog = new THREE.FogExp2(this.scene.background, 0.03);

		this.camera.position.set(10, 4, 20);
		this.camera.lookAt(10, 4, 0);
		this.camera.rotation.order = "YXZ"; 
	}

	addBox(group, x, y, z, t)
	{
		let m = new THREE.Mesh(this.assets.boxGeometry, this.assets.grassMaterial);
		m.position.set(x, y, z);
		group.add(m);
	}

	getBlock(x, y, z)
	{
		if (y < HEIGHT_MIN) return 1;
		let h = Math.floor(Utils.perlin.noise(x/10, z/10) * (HEIGHT_MAX - HEIGHT_MIN)) + HEIGHT_MIN;
		return (y > h)? 0 : 1;
	}

	getBlocks(x, y, z)
	{
		let b = {};
		b.id = this.getBlock(x, y, z);

		b.nx = this.getBlock(x-1, y, z);
		b.px = this.getBlock(x+1, y, z);
		b.ny = this.getBlock(x, y-1, z);
		b.py = this.getBlock(x, y+1, z);
		b.nz = this.getBlock(x, y, z-1);
		b.pz = this.getBlock(x, y, z+1);

		b.hidden = (b.nx && b.px && b.ny && b.py && b.nz && b.pz);

		return b;
	}

	addCBox(box, b, x, y, z, t)
	{
		box.matrix.makeTranslation(x, y, z);

		if (b.px == 0) box.add(box.px);
		if (b.nx == 0) box.add(box.nx);
		if (b.py == 0) box.add(box.py);
		if (b.ny == 0) box.add(box.ny);
		if (b.pz == 0) box.add(box.pz);
		if (b.nz == 0) box.add(box.nz);
	}


	addChunk(x, z)
	{
		let name = x+','+z;
		if (this.chunks[name]) return;

		// let chunk = new THREE.Group();
		// chunk.name = name;

		let box = new CustomBoxGeometry(this.assets.boxMaterial);
		box.name = name;

		let cx = x*CHUNK_SIZE;
		let cz = z*CHUNK_SIZE;

		for(let i = 0; i < CHUNK_SIZE; i++) {
			for(let j = 0; j < CHUNK_SIZE; j++) {
				for(let y = HEIGHT_MAX; y > HEIGHT_MIN; y--) {
					let b = this.getBlocks(cx+j, y, cz+i);
					if (b.id == 0 || b.hidden) continue;

					this.addCBox(box, b, cx+j, y, cz+i, b);
					//this.addBox(chunk, cx+j, y, cz+i, b);
				}
			}
		}

		this.scene.add(box.mesh());
		this.chunks[name] = {x, z, name};
	}

	updateChunks(pos)
	{
		let cx = Math.floor(pos.x / CHUNK_SIZE);
		let cz = Math.floor(pos.z / CHUNK_SIZE);

		if (this.cpos.x == cx && this.cpos.z == cz) return;

		for (let c of Object.values(this.chunks)) {
			if (Math.abs(c.x - cx) < 2 && Math.abs(c.z - cz) < 2) continue;
			
			//remove chunk
			let chunk = this.scene.getObjectByName(c.name);
			this.scene.remove(chunk);
			delete this.chunks[c.name];
		}

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				this.addChunk(cx + i, cz + j);
			}
		}

		this.cpos = this.chunks[cx +','+cz];
	}

	addLights()
	{
		let ambientLight = new THREE.AmbientLight( 0x999999 );
		this.scene.add( ambientLight );

		let directionalLight = new THREE.DirectionalLight( 0x999999, 2 );
		directionalLight.position.set( 1, 1, 0.5 ).normalize();
		this.scene.add( directionalLight );
	}

	update()
	{
		this.requestUpdate();

		if (!this.isPointerLock()) {
			this.renderer.render( this.scene, this.camera );
			return;
		}

		let pos = this.camera.position;

		this.camera.rotation.x = -(this.mouse.vy / window.innerHeight - 0.5) * Utils.TWO_PI;
		this.camera.rotation.y = -(this.mouse.vx / window.innerWidth - 0.5) * Utils.TWO_PI;

		this.camera.rotation.x = Utils.clamp(this.camera.rotation.x, -1.5, 1.5);

		if (this.kbmap['ArrowUp']) {
			pos.x -= Math.sin(this.camera.rotation.y) * .1;
			pos.z -= Math.cos(this.camera.rotation.y) * .1;	
		}

		if (this.kbmap['ArrowDown']) {
			pos.x += Math.sin(this.camera.rotation.y) * .1;
			pos.z += Math.cos(this.camera.rotation.y) * .1;
		}


		if (this.kbmap['ArrowLeft']) {
			pos.x -= Math.cos(this.camera.rotation.y) * .1;
			pos.z -= -Math.sin(this.camera.rotation.y) * .1;			
		}

		if (this.kbmap['ArrowRight']) {
			pos.x += Math.cos(this.camera.rotation.y) * .1;
			pos.z += -Math.sin(this.camera.rotation.y) * .1;			
		}

		if (this.mouse.hold == this.MB_LEFT) pos.y += .1;
		if (this.mouse.hold == this.MB_RIGHT) pos.y -= .1;

		if (this.mouse.buttons) {
			this.mouse.buttons = 0;
		}

		this.updateChunks(pos);

		this.renderer.render( this.scene, this.camera );
	}
}

class CustomBoxGeometry
{
	constructor(material)
	{
		this.i = 0;
		this.name = '';
		this.material = material;
		this.matrix = new THREE.Matrix4();
		this.geometry = new THREE.Geometry();

		this.px = new THREE.PlaneGeometry(1, 1);
	
		this.px.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
		this.px.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
		this.px.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;

		this.px.rotateY( Math.PI / 2 );
		this.px.translate( 0.5, 0, 0 );

		this.nx = new THREE.PlaneGeometry(1, 1);

		this.nx.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
		this.nx.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
		this.nx.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;

		this.nx.rotateY( - Math.PI / 2 );
		this.nx.translate( -0.5, 0, 0 );

		this.py = new THREE.PlaneGeometry(1, 1);
		
		this.py.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0.5;
		this.py.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 0.5;
		this.py.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 0.5;

		this.py.rotateX( - Math.PI / 2 );
		this.py.translate( 0, 0.5, 0 );

		this.ny = new THREE.PlaneGeometry(1, 1);

		this.ny.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0.5;
		this.ny.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 0.5;
		this.ny.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 0.5;
		
		this.ny.rotateX( - Math.PI / 2 );
		this.ny.translate( 0, -0.5, 0 );

		this.pz = new THREE.PlaneGeometry(1, 1);

		this.pz.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
		this.pz.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
		this.pz.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;

		this.pz.translate( 0, 0, 0.5 );

		this.nz = new THREE.PlaneGeometry(1, 1);

		this.nz.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
		this.nz.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
		this.nz.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;

		this.nz.rotateY( Math.PI );
		this.nz.translate( 0, 0, -0.5 );
	}

	add(g)
	{
		this.geometry.merge(g, this.matrix);
	}

	mesh()
	{
		let m = new THREE.Mesh(
			new THREE.BufferGeometry().fromGeometry(this.geometry), 
			this.material
		);

		m.name = this.name;
		return m;
	}
}