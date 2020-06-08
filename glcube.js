//Empty template

class Main extends NextGameGL {

	init()
	{
		super.init();

		this.objects = [];
		this.mesh = {}
		this.light = null;

		this.initMesh();
		this.createScene();
		this.addLights();
	}

	initMesh()
	{
		const textureLoader = new THREE.TextureLoader();

		let texture = textureLoader.load( 'images/wallset_csb_front2.png' );
		texture.anisotropy = 16;
		
		let geometry = new THREE.BoxGeometry(2,2,2);
		let material = new THREE.MeshLambertMaterial( { map: texture, color: '#FFFFFF' } );

		this.mesh.cube = new THREE.Mesh( geometry, material );
	}

	createScene()
	{
		let m = this.mesh.cube.clone();
		this.scene.add(m);
		this.objects.push(m);
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

		if (this.kbmap['ArrowUp']) {
			this.camera.position.z -= 0.1;
		}

		if (this.kbmap['ArrowDown']) {
			this.camera.position.z += 0.1;
		}

		this.scene.rotation.x = this.mouse.y / 200 - 0.8;
		this.scene.rotation.y = this.mouse.x / 200 - 3.5;

		if (this.mouse.buttons) {
			this.mouse.buttons = 0;
		}

		for (let o of this.objects) {
			o.rotation.x += 0.01;
			o.rotation.y += 0.01;
		}

		this.renderer.render( this.scene, this.camera );

		this.time = this.now();
	}
}