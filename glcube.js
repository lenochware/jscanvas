//Empty template

class Main extends NextGameGL {

	init()
	{
		super.init();

		this.objects = [];
		this.mesh = {}
		this.light = null;

		this.canvas2d = this.getCanvas2d();

		this.initMesh();
		this.createScene();
		this.addLights();
	}

	initMesh()
	{
		const textureLoader = new THREE.TextureLoader();

		let texture = textureLoader.load( 'images/wallset_csb_front2.png' );
		texture.anisotropy = 16;
		
		let geometry = new THREE.BoxGeometry(1,1,1);
		let material = new THREE.MeshLambertMaterial( { map: texture, color: '#FFFFFF' } );

		this.mesh.cube = new THREE.Mesh( geometry, material );


		const material2 = new THREE.MeshBasicMaterial({
		  map: new THREE.CanvasTexture(this.canvas2d),
		});

		this.mesh.drawCube = new THREE.Mesh( geometry, material2 );

	}

	createScene()
	{
		let m = this.mesh.cube.clone();
		m.position.x -= 1;
		this.scene.add(m);
		this.objects.push(m);

		m = this.mesh.drawCube.clone();
		m.position.x += 1;
		m.userData.updateTexture = true;
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


	getCanvas2d()
	{
		const ctx = document.createElement('canvas').getContext('2d');
		ctx.canvas.width = 256;
		ctx.canvas.height = 256;
		ctx.fillStyle = '#F00';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		return ctx.canvas;	
	}

	drawCanvas()
	{
    let ctx = this.canvas2d.getContext('2d');
    ctx.fillStyle = '#' + Utils.random(0, 0x1000000).toString(16).padStart(6, '0');
    ctx.beginPath();

    const x = Utils.random(0, 256);
    const y = Utils.random(0, 256);
    const radius = Utils.random(10, 64);
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
	}

	update()
	{
		this.requestUpdate();

		this.drawCanvas();

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
			if (o.userData.updateTexture) o.material.map.needsUpdate = true;

			o.rotation.x += 0.01;
			o.rotation.y += 0.01;
		}

		this.renderer.render( this.scene, this.camera );

		this.time = this.now();
	}
}