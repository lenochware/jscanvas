//Empty template

class Main extends NextGameGL {

	init()
	{
		super.init();

		this.light = null;

		this.cpos = {x:0, z:0};
		this.chunks = [];
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
		for (let cpos of this.chunks) {
			if (!cpos) continue;
			if (cpos.x == x && cpos.z == z) return;
		}

		let chunk = new THREE.Group();
		chunk.name = x+','+z;

		for(let i = 0; i < 16; i++) {
			for(let j = 0; j < 16; j++) {
				let y = Math.floor(Utils.perlin.noise((x*16+j)/10, (z*16+i)/10) * 16) - 4;
				this.addBox(chunk, x*16+j, y, z*16+i, 0);
			}
		}

		this.scene.add(chunk);
		this.chunks.push({x, z});
	}

	updateChunks(pos)
	{
		let cx = Math.floor(pos.x / 16);
		let cz = Math.floor(pos.z / 16);

		if (this.cpos.x == cx && this.cpos.z == cz) return;

		this.cpos.x = cx;
		this.cpos.z = cz;

		console.log(this.cpos, this.chunks);

		for (let i in this.chunks) {
			let cpos = this.chunks[i];
			if (!cpos || (Math.abs(cpos.x - cx) < 2 && Math.abs(cpos.z - cz) < 2)) continue;
			
			//remove chunk
			let chunk = this.scene.getObjectByName(cpos.x + ',' + cpos.z);
			this.scene.remove(chunk);
			this.chunks[i] = null;
		}

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				this.addChunk(cx + i, cz + j);
			}
		}
	}

	addLights()
	{
		// create a point light
		this.light = new THREE.PointLight(0xFFFFFF, 1, 15, 1);
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

		this.camera.rotation.x = -(this.mouse.vy / window.innerHeight - 0.5) * Utils.TWO_PI;
		this.camera.rotation.y = -(this.mouse.vx / window.innerWidth - 0.5) * Utils.TWO_PI;

		this.camera.rotation.x = Utils.clamp(this.camera.rotation.x, -1.5, 1.5);

		if (this.kbmap['ArrowUp']) {
			this.camera.position.x -= Math.sin(this.camera.rotation.y) * .1;
			this.camera.position.z -= Math.cos(this.camera.rotation.y) * .1;	
		}

		if (this.kbmap['ArrowDown']) {
			this.camera.position.x += Math.sin(this.camera.rotation.y) * .1;
			this.camera.position.z += Math.cos(this.camera.rotation.y) * .1;
		}


		if (this.kbmap['ArrowLeft']) {
			this.camera.position.x -= Math.cos(this.camera.rotation.y) * .1;
			this.camera.position.z -= -Math.sin(this.camera.rotation.y) * .1;			
		}

		if (this.kbmap['ArrowRight']) {
			this.camera.position.x += Math.cos(this.camera.rotation.y) * .1;
			this.camera.position.z += -Math.sin(this.camera.rotation.y) * .1;			
		}

		this.updateChunks(this.camera.position);

		this.light.position.set(
			this.camera.position.x,
			this.camera.position.y + 5,
			this.camera.position.z + 2,
		);

		if (this.mouse.buttons) {
			this.mouse.buttons = 0;
		}

		this.renderer.render( this.scene, this.camera );
		this.time = this.now();
	}
}