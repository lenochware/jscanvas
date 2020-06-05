//Empty template

class Main extends NextGameGL {

	init()
	{
		super.init();

		const textureLoader = new THREE.TextureLoader();
		this.textures.wall = textureLoader.load( 'images/wallset_csb_front2.png' );
		this.textures.wall.anisotropy = 16;

		var geometry = new THREE.BoxGeometry(2,2,2);
		var material = new THREE.MeshLambertMaterial( { map: this.textures.wall, color: '#FFFFFF' } );
		this.cube = new THREE.Mesh( geometry, material );
		this.scene.add( this.cube );

		this.addLights();
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

		this.cube.rotation.x = this.mouse.y / 200;
		this.cube.rotation.y = this.mouse.x / 200;

		this.renderer.render( this.scene, this.camera );

		this.time = this.now();
	}
}