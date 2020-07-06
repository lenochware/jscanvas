//Empty template

class Main extends NextGameGL {

	init()
	{
		super.init();

		this.light = null;

		this.objects = [];
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
	}

	createScene()
	{
		this.scene.background = new THREE.Color( 0x8cc4fe );

		this.addChunk(0,0);
		this.addChunk(0,-20);

		//this.scene.position.set(-10,0,-10);
		this.camera.position.set(10, 4, 20);
		this.camera.lookAt(10, 4, 0);
		this.camera.rotation.order = "YXZ"; 
		//this.camera.up.set(0,1,0);
	}

	addBox(group, x, y, z, t)
	{
		let m = new THREE.Mesh(this.assets.boxGeometry, this.assets.grassMaterial);
		m.position.set(x, y, z);
		group.add(m);
	}

	addChunk(x, z)
	{
		let chunk = new THREE.Group();
		chunk.name = x+','+z;

		for(let i = 0; i < 20; i++) {
			for(let j = 0; j < 20; j++) {
				let y = Math.floor(Utils.perlin.noise((x+j)/10, (z+i)/10) * 5);
				this.addBox(chunk, x+j, y, z+i, 0);
			}
		}

		this.scene.add(chunk);
	}

	addLights()
	{
		// create a point light
		this.light = new THREE.PointLight(0xFFFFFF, 1);

		// set its position
		this.light.position.x = 10;
		this.light.position.y = 50;
		this.light.position.z = 130;

		this.scene.add(this.light);		

		const am = new THREE.AmbientLight( 0x404040 ); // soft white light
		this.scene.add(am);
	}

	update()
	{
		this.requestUpdate();

		this.camera.rotation.x = -(this.mouse.y / window.innerHeight - 0.5) * Utils.TWO_PI;
		this.camera.rotation.y = -(this.mouse.x / window.innerWidth - 0.5) * Utils.TWO_PI;

		this.camera.rotation.x = Utils.clamp(this.camera.rotation.x, -1.5, 1.5);

		if (this.kbmap['ArrowUp']) {
			this.camera.position.x -= Math.sin(this.camera.rotation.y) * .1;
			this.camera.position.z -= Math.cos(this.camera.rotation.y) * .1;			
			//this.camera.position.z -= 0.1;
		}

		if (this.kbmap['ArrowDown']) {
			this.camera.position.x += Math.sin(this.camera.rotation.y) * .1;
			this.camera.position.z += Math.cos(this.camera.rotation.y) * .1;
			//this.camera.position.z += 0.1;
		}


		if (this.kbmap['ArrowLeft']) {
			this.camera.position.x -= Math.cos(this.camera.rotation.y) * .1;
			this.camera.position.z -= -Math.sin(this.camera.rotation.y) * .1;			
		}

		if (this.kbmap['ArrowRight']) {
			this.camera.position.x += Math.cos(this.camera.rotation.y) * .1;
			this.camera.position.z += -Math.sin(this.camera.rotation.y) * .1;			
		}

		if (this.mouse.buttons) {
			let chunk = this.scene.getObjectByName("0,-20");
			this.scene.remove(chunk);
			console.log('removed.');
			this.mouse.buttons = 0;
		}

		this.renderer.render( this.scene, this.camera );
		this.time = this.now();
	}
}