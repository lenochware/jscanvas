const CHUNK_SIZE = 16;
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

		let grass = [
			loader.load('images/grass-top.png'),
			loader.load('images/grass-side.png'),
			loader.load('images/dirt.png')
		];

		grass[0].magFilter = THREE.NearestFilter;
		grass[1].magFilter = THREE.NearestFilter;
		grass[2].magFilter = THREE.NearestFilter;

		this.assets.grassMaterial = [
       new THREE.MeshLambertMaterial({ map: grass[1] }),
       new THREE.MeshLambertMaterial({ map: grass[1] }),
       new THREE.MeshLambertMaterial({ map: grass[0] }),
       new THREE.MeshLambertMaterial({ map: grass[1] }),
       new THREE.MeshLambertMaterial({ map: grass[1] }),
       new THREE.MeshLambertMaterial({ map: grass[2] })
    ];

		this.assets.boxGeometry = new THREE.BoxBufferGeometry(1,1,1);
		this.assets.basicMaterial = new THREE.MeshLambertMaterial({color:'#3f3'});
		//this.assets.basicMaterial = new THREE.MeshNormalMaterial();

		//this.controls = new THREE.PointerLockControls();

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


	addChunk(x, z)
	{
		let name = x+','+z;
		if (this.chunks[name]) return;

		let chunk = new THREE.Group();
		chunk.name = name;

		let cx = x*CHUNK_SIZE;
		let cz = z*CHUNK_SIZE;

		for(let i = 0; i < CHUNK_SIZE; i++) {
			for(let j = 0; j < CHUNK_SIZE; j++) {
				for(let y = HEIGHT_MAX; y > HEIGHT_MIN; y--) {
					let b = this.getBlocks(cx+j, y, cz+i);
					if (b.id == 0 || b.hidden) continue;
					this.addBox(chunk, cx+j, y, cz+i, b);
				}
			}
		}

		this.scene.add(chunk);
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