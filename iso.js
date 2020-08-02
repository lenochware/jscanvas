class Main extends NextGameGL {

	init()
	{
		super.init();
		//this.fullScreen();

		this.raycaster = new THREE.Raycaster();
    this.selected = null;

		// (left, up, backward)
		// let width = 20;
		// let height = 20;
		// this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2);
		this.camera.position.set(0, 4, 10);
		this.camera.lookAt(0, 0, 0);
		this.camera.rotation.order = "YXZ";

		const textureLoader = new THREE.TextureLoader();
		this.texture = textureLoader.load( 'images/dg_features32.gif' );
		this.texture.magFilter = THREE.NearestFilter;
		//this.texture.anisotropy = 16;

		this.createScene();
		this.addLights();
	}

	setTexture(m, idx)
	{
		 let w = 9;
		 let h = 13;

		 let u = idx % w / w;
		 let v = Math.floor(idx / w) / h;

		 let face = m.geometry.faceVertexUvs[0];
		 face[0][0].set(u, v);
		 face[0][1].set(u + 1/w, v + 1/h);
		 face[0][2].set(u, v + 1/h);
		 face[1][0].set(u, v);
		 face[1][1].set(u + 1/w, v);
		 face[1][2].set(u + 1/w, v + 1/h);

		 m.geometry.uvsNeedUpdate = true;

	 // geometry.faceVertexUvs[0].push(
	 //  // front
	 //  [ new THREE.Vector2(u, v), new THREE.Vector2(u + 1/w, v + 1/h), new THREE.Vector2(u, v + 1/h) ],
	 //  [ new THREE.Vector2(u, v), new THREE.Vector2(u + 1/w, v), new THREE.Vector2(u + 1/w, v + 1/h) ],
  // );

	}

	createScene()
	{
		const box = this.createBox();
		//const mat1 = new THREE.MeshLambertMaterial( { /*map: this.texture,*/ color: '#FFFFFF' } );
		const mat1 = new THREE.MeshLambertMaterial( { map: this.texture, color: '#FFFFFF' } );
		//const mat1 = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors});

		//this.setTexture(box.py, 0);

		for(let y = 0; y < 10; y++) {
			for(let x = 0; x < 10; x++) {
				let m = new THREE.Mesh(box.py.clone(), mat1);
				m.position.set(x - 5, 0, y - 5);
				m.name = x + ',' + y;
				if (x == y) this.setTexture(m, 8); else this.setTexture(m, 18);
				this.scene.add(m);
			}
		}
	}

	addLights()
	{
		//const am = new THREE.AmbientLight( 0x404040 ); // soft white light
		const am = new THREE.AmbientLight( 0xffffff ); // soft white light
		this.scene.add(am);
	}

	update()
	{
		this.requestUpdate();
			
			//this.debugText(mousePos);

		// if (!this.isPointerLock()) {
		// 	this.renderer.render( this.scene, this.camera );
		// 	return;
		// }		

		if (this.kbmap['ArrowUp']) {
			this.scene.rotation.x += 0.05;
		}

		if (this.kbmap['ArrowDown']) {
			this.scene.rotation.x -= 0.05;
		}

		if (this.kbmap['ArrowLeft']) {
			this.scene.rotation.y += 0.05;
		}

		if (this.kbmap['ArrowRight']) {
			this.scene.rotation.y -= 0.05;
		}

		if (this.mouse.buttons)
		{
			let obj = this.mousePickObj();
			if (obj) {
				this.debugText(obj.name);
				this.setTexture(obj, 7*9 + 0);
			}


			this.mouse.buttons = 0;
		}

		this.renderer.render( this.scene, this.camera );

		this.mouse.mx = 0;
		this.mouse.my = 0;		
	}

	mousePickObj()
	{
		let mousePos = {
			x : this.mouse.x / this.canvas.width * 2 - 1, 
			y: this.mouse.y / this.canvas.height * -2 + 1
		};

  	this.raycaster.setFromCamera(mousePos, this.camera);
  	// get the list of objects the ray intersected
  	const intersectedObjects = this.raycaster.intersectObjects(this.scene.children);
  	if (intersectedObjects.length) {
    	return intersectedObjects[0].object;
    }
    else return null;
	}

	createPlane()
	{
		const geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(-.5, -.5,  0),
      new THREE.Vector3( .5, -.5,  0),
      new THREE.Vector3(-.5,  .5,  0),
      new THREE.Vector3( .5,  .5,  0)
    );

    geometry.faces.push(
		  new THREE.Face3(0, 3, 2),
		  new THREE.Face3(0, 1, 3)
		);

		// geometry.faces[0].color =  new THREE.Color('red');
		// geometry.faces[1].color =  new THREE.Color('yellow');

		// geometry.faces[0].vertexColors = [
	 //    (new THREE.Color()).setHSL(0  , 1, 0.5),
	 //    (new THREE.Color()).setHSL(0.1, 1, 0.5),
	 //    (new THREE.Color()).setHSL(0.2, 1, 0.5),
	 //  ];

		geometry.faceVertexUvs[0].push(
		  [ new THREE.Vector2(0, 0), new THREE.Vector2(0, 0), new THREE.Vector2(0, 0) ],
		  [ new THREE.Vector2(0, 0), new THREE.Vector2(0, 0), new THREE.Vector2(0, 0) ],
	  );
	 
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