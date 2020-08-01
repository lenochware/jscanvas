class Main extends NextGameGL {

	init()
	{
		super.init();
		this.fullScreen();

		this.light = null;

		// (left, up, backward)
		// let width = 20;
		// let height = 20;
		// this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2);
		this.camera.position.set(0, 4, 10);
		this.camera.lookAt(0, 0, 0);
		this.camera.rotation.order = "YXZ";

		const textureLoader = new THREE.TextureLoader();
		this.texture = textureLoader.load( 'images/dg_features32.gif' );
		this.texture.anisotropy = 16;

		this.createScene();
		this.addLights();
	}

	setTexture(p, tex)
	{
		let h = 1/13;

		// 0, face, vertex
		p.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 1 - (h + h * tex);
		p.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 1 - (h + h * tex);
		p.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 1 - (h + h * tex);

		p.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 1 - h * tex;
		p.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 1 - h * tex;
		p.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 1 - h * tex;

	}

	createScene()
	{
		const box = this.createBox();
		//const mat1 = new THREE.MeshLambertMaterial( { /*map: this.texture,*/ color: '#FFFFFF' } );
		const mat1 = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors});

		//this.setTexture(box.py, 0);

		for(let y = 0; y < 10; y++) {
			for(let x = 0; x < 10; x++) {
				let m = new THREE.Mesh(box.py, mat1);
				m.position.set(x - 5, 0, y - 5);
				this.scene.add(m);
			}
		}

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

	createPlane()
	{
		const geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(-.5, -.5,  0),  // 0
      new THREE.Vector3( .5, -.5,  0),  // .5
      new THREE.Vector3(-.5,  .5,  0),  // 2
      new THREE.Vector3( .5,  .5,  0)  // 3
    );

    geometry.faces.push(
		  // front
		  new THREE.Face3(0, 3, 2),
		  new THREE.Face3(0, 1, 3)
		);

		geometry.faces[ 0].color =  new THREE.Color('red');
		geometry.faces[ 1].color =  new THREE.Color('yellow');

		return geometry;
}

	createBox()
	{
		let box = {};

		box.px = this.createPlane();
		box.px.rotateY( Math.PI / 2 );
		box.px.translate( 0.5, 0, 0 );

		box.nx = this.createPlane();
		box.nx.rotateY( - Math.PI / 2 );
		box.nx.translate( -0.5, 0, 0 );

		box.py = this.createPlane();
		box.py.rotateX( - Math.PI / 2 );
		box.py.translate( 0, 0.5, 0 );

		box.ny = this.createPlane();
		// box.ny.rotateX( Math.PI / 2 );
		box.ny.rotateX( - Math.PI / 2 );
		box.ny.translate( 0, -0.5, 0 );

		box.pz = this.createPlane();
		box.pz.translate( 0, 0, 0.5 );

		box.nz = this.createPlane();
		box.nz.rotateY( Math.PI );
		box.nz.translate( 0, 0, -0.5 );		

		return box;
	}	
}