class Main extends NextGameGL {

	init()
	{
		super.init();
		this.fullScreen();

		this.light = null;

		// (left, up, backward)
		this.camera.position.set(0, 4, 10);
		this.camera.lookAt(0, 0, 0);
		this.camera.rotation.order = "YXZ"; 			

		this.createScene();
		this.addLights();
	}

	initMesh()
	{
		const textureLoader = new THREE.TextureLoader();
		let texture = textureLoader.load( 'images/wallset_csb_front2.png' );
		texture.anisotropy = 16;
	}

	createScene()
	{
		const box = this.createBox();
		const mat1 = new THREE.MeshLambertMaterial( { /*map: texture,*/ color: '#30FF30' } );

		let m = new THREE.Mesh(box.py, mat1);

		this.scene.add(m);

		// m = this.mesh.cube2.clone();
		// m.position.x += 1.5;
		// this.scene.add(m);

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

		this.debugText(this.mouse.mx);

		if (!this.isPointerLock()) {
			this.renderer.render( this.scene, this.camera );
			return;
		}		

		if (this.kbmap['ArrowUp']) {
			this.camera.position.z -= 0.1;
		}

		if (this.kbmap['ArrowDown']) {
			this.camera.position.z += 0.1;
		}

		this.scene.rotation.x += (this.mouse.my / window.innerHeight) * Utils.TWO_PI;
		this.scene.rotation.y += (this.mouse.mx / window.innerWidth) * Utils.TWO_PI;		

		if (this.mouse.buttons) {
			this.mouse.buttons = 0;
		}

		this.renderer.render( this.scene, this.camera );

		this.mouse.mx = 0;
		this.mouse.my = 0;		
	}

	createBox()
	{
		let box = {};

		box.px = new THREE.PlaneGeometry(1, 1);
		box.px.rotateY( Math.PI / 2 );
		box.px.translate( 0.5, 0, 0 );

		box.nx = new THREE.PlaneGeometry(1, 1);
		box.nx.rotateY( - Math.PI / 2 );
		box.nx.translate( -0.5, 0, 0 );

		box.py = new THREE.PlaneGeometry(1, 1);
		box.py.rotateX( - Math.PI / 2 );
		box.py.translate( 0, 0.5, 0 );

		box.ny = new THREE.PlaneGeometry(1, 1);
		// box.ny.rotateX( Math.PI / 2 );
		box.ny.rotateX( - Math.PI / 2 );
		box.ny.translate( 0, -0.5, 0 );

		box.pz = new THREE.PlaneGeometry(1, 1);
		box.pz.translate( 0, 0, 0.5 );

		box.nz = new THREE.PlaneGeometry(1, 1);
		box.nz.rotateY( Math.PI );
		box.nz.translate( 0, 0, -0.5 );		

		return box;
	}	
}