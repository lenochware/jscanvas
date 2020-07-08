const CHUNK_SIZE = 16;

class Main extends NextGameGL {

	init()
	{
		super.init();

		this.light = null;

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

	addChunk(x, z)
	{
		let name = x+','+z;
		if (this.chunks[name]) return;

		let chunk = new THREE.Group();
		chunk.name = name;
		let heightmap = [];

		for(let i = 0; i < CHUNK_SIZE; i++) {
			heightmap[i] = [];
			for(let j = 0; j < CHUNK_SIZE; j++) {
				let y = Math.floor(Utils.perlin.noise((x*CHUNK_SIZE+j)/10, (z*CHUNK_SIZE+i)/10) * CHUNK_SIZE) - 4;
				this.addBox(chunk, x*CHUNK_SIZE+j, y, z*CHUNK_SIZE+i, 0);
				heightmap[i][j] = y;
			}
		}

		this.scene.add(chunk);
		this.chunks[name] = {x, z, heightmap, name};
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
		// create a point light
		this.light = new THREE.PointLight(0xFFFFFF, 1, 20);
		this.light.position.set(10, 50, 130);
		this.scene.add(this.light);		

		// var dl = new THREE.DirectionalLight( 0xffffff, 1);
		// dl.position.set(0,1,1);
		// this.scene.add(dl);

		const am = new THREE.AmbientLight( 0x404040 ); // soft white light
		this.scene.add(am);
	}

	update()
	{
		this.requestUpdate();

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

		this.updateChunks(pos);

		if (this.cpos.heightmap) {
			let hz = Math.floor(pos.z % 16);
			let hx = Math.floor(pos.x % 16);
			if (hz < 0) hz = hz + 15;
			if (hx < 0) hx = hx + 15;

			//console.log(hz, hx);
			pos.y = this.cpos.heightmap[hz][hx] + 2;
			//console.log(pos.y);
		}

		this.light.position.set(
			pos.x,
			pos.y + 6,
			pos.z + 2,
		);

		if (this.mouse.buttons) {
			this.mouse.buttons = 0;
		}

		this.renderer.render( this.scene, this.camera );
		this.time = this.now();
	}
}