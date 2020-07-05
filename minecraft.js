//Empty template

class Main extends NextGameGL {

	init()
	{
		super.init();

		this.light = null;

		this.objects = [];
		this.assets = {}

		this.assets.boxGeometry = new THREE.BoxGeometry(1,1,1);
		this.assets.basicMaterial = new THREE.MeshLambertMaterial({color:'#3f3'});
		//this.assets.basicMaterial = new THREE.MeshNormalMaterial();

		//this.controls = new THREE.PointerLockControls();

		this.createScene();
		this.addLights();
	}

	addBox(x, y, z, t)
	{
		let m = new THREE.Mesh(this.assets.boxGeometry, this.assets.basicMaterial);
		m.position.set(x, y, z);
		this.scene.add(m);
	}

	createScene()
	{
		for(let z = 0; z < 20; z++) {
			for(let x = 0; x < 20; x++) {
				let y = Math.floor(Utils.perlin.noise(x/10, z/10) * 5);
				this.addBox(x, 1, z, 0);
			}
		}

		//this.scene.position.set(-10,0,-10);
		this.camera.position.set(10, 4, 20);
		this.camera.lookAt(10, 4, 0);
		this.camera.rotation.order = "YXZ"; 
		//this.camera.up.set(0,1,0);
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
			this.camera.position.x -= 0.1;
		}

		if (this.kbmap['ArrowRight']) {
			this.camera.position.x += 0.1;
		}

		if (this.mouse.buttons) {
			this.mouse.buttons = 0;
		}

		this.renderer.render( this.scene, this.camera );
		this.time = this.now();
	}
}