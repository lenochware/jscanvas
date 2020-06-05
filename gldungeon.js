//Empty template

class Main extends NextGameGL {

	init()
	{
		super.init();

		this.objects = {};
		this.light = null;

		const textureLoader = new THREE.TextureLoader();

		let wall = {};

		wall.texture = textureLoader.load( 'images/wallset_csb_front2.png' );
		wall.texture.anisotropy = 16;
		wall.geometry = new THREE.BoxGeometry(2,2,2);
		wall.material = new THREE.MeshLambertMaterial( { map: wall.texture, color: '#FFFFFF' } );

		this.objects.wall = wall;

		this.createScene();
		this.addLights();
	}

	createScene()
	{
		let wall = this.objects.wall;
		let m = new THREE.Mesh( wall.geometry, wall.material );
		this.scene.add(m);
	}

	addWall(x, y, n)
	{
	}

	addLights()
	{
		// create a point light
		this.light = new THREE.PointLight(0xFFFFFF, 1);

		// set its position
		this.light.position.x = 10;
		this.light.position.y = 50;
		this.light.position.z = 130;

		// add to the scene
		this.scene.add(this.light);		
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

		if (this.kbmap['ArrowLeft']) {
			this.camera.position.x -= 0.1;
		}

		if (this.kbmap['ArrowRight']) {
			this.camera.position.x += 0.1;
		}

		if (this.mouse.buttons) {
			this.mouse.buttons = 0;
		}

		this.camera.rotation.x = this.mouse.y / 400 - 1;
		this.camera.rotation.y = this.mouse.x / 800 - 1;

		this.light.position.set(
			this.camera.position.x,
			this.camera.position.y,
			this.camera.position.z
		)  

		this.renderer.render( this.scene, this.camera );

		this.time = this.now();
	}
}