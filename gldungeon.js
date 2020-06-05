//Empty template

class Main extends NextGameGL {

	init()
	{
		super.init();

		this.objects = {};

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
		const pointLight = new THREE.PointLight(0xFFFFFF, 1);

		// set its position
		pointLight.position.x = 10;
		pointLight.position.y = 50;
		pointLight.position.z = 130;

		// add to the scene
		this.scene.add(pointLight);		
	}

	update()
	{
		this.requestUpdate();

		if (this.kb.key == 'SomeKey') {
			this.kb.key = '';
		};

		if (this.mouse.buttons) {
			this.mouse.buttons = 0;
		}

		this.camera.rotation.x = this.mouse.y / 400 - 1;
		this.camera.rotation.y = this.mouse.x / 800 - 1;

		this.renderer.render( this.scene, this.camera );

		this.time = this.now();
	}
}