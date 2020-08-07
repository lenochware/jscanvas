class Main extends NextGameGL {

	init()
	{
		super.init();
		this.fullScreen();

		// (left, up, backward)
		this.camera.position.set(0, 0.2, 5);
		this.camera.lookAt(0, 0.2, 0);
		this.camera.rotation.order = "YXZ"; 		

		this.light = null;
		this.level = this.level = JSON.parse(localStorage.getItem('lev01'));

		this.player = new Player(this);

		const textureLoader = new THREE.TextureLoader();
		this.texture = textureLoader.load( 'images/dg_features32.gif' );
		this.texture.magFilter = THREE.NearestFilter;
		this.texture.minFilter = THREE.NearestFilter;
		//this.texture.anisotropy = 16;

		this.box = this.createBox();
		this.material = new THREE.MeshLambertMaterial( { map: this.texture, color: '#FFFFFF' } );

		this.createScene();
	}

	createScene()
	{
		this.scene.background = new THREE.Color( 0x6666ff );

		for(let key of Object.keys(this.level)) {
			let pos = key.split(',');
			let tex = this.level[key].tex;
			let m = new THREE.Mesh(this.box[pos[2]].clone(), this.material);
			m.position.set(pos[0] - 5, 0, pos[1] - 5);
			m.name = key;
			this.setTexture(m, tex);
			this.scene.add(m);
		}
		this.addLights();
	}


	addLights()
	{
		this.light = new THREE.PointLight(0xFFFFFF, 2, 6);
		this.light.position.copy(this.camera.position);
		//this.light.position.set(4, 3, 4);
		//this.scene.add(this.light);		

		let directionalLight = new THREE.DirectionalLight( 0x999999, 2 );
		directionalLight.position.set( 1, 1, 0.5 ).normalize();
		this.scene.add( directionalLight );

		const am = new THREE.AmbientLight( 0x333333 ); // soft white light
		this.scene.add(am);
	}

	update()
	{
		this.requestUpdate();

		this.debugText(this.mouse.mx);
		//this.debugText(this.camera.rotation);


		if (!this.isPointerLock()) {
			this.renderer.render( this.scene, this.camera );
			return;
		}

		this.playerMove();

		// if (this.kbmap['ArrowUp']) {
		// 	this.camera.position.z -= 0.1;
		// }

		// if (this.kbmap['ArrowDown']) {
		// 	this.camera.position.z += 0.1;
		// }

		// if (this.kbmap['ArrowLeft']) {
		// 	this.camera.position.x -= 0.1;
		// }

		// if (this.kbmap['ArrowRight']) {
		// 	this.camera.position.x += 0.1;
		// }

		// if (this.mouse.buttons) {
		// 	this.mouse.buttons = 0;
		// }

		// this.camera.rotation.x = this.mouse.y / 400 - 1;
		// this.camera.rotation.y = this.mouse.x / 800 - 1;

		// this.light.position.set(
		// 	this.camera.position.x,
		// 	this.camera.position.y,
		// 	this.camera.position.z
		// )  

		this.renderer.render( this.scene, this.camera );
		this.light.position.copy(this.camera.position);

		this.mouse.mx = 0;
		this.mouse.my = 0;
	}

	playerMove()
	{
		let pos = this.camera.position;

		this.camera.rotation.x -= (this.mouse.my / window.innerHeight) * Utils.TWO_PI;
		this.camera.rotation.y -= (this.mouse.mx / window.innerWidth) * Utils.TWO_PI;

		this.camera.rotation.x = Utils.clamp(this.camera.rotation.x, -1.5, 1.5);

		if (this.kbmap['ArrowUp']) {
			pos.x -= Math.sin(this.camera.rotation.y) * .05;
			pos.z -= Math.cos(this.camera.rotation.y) * .05;	
		}

		if (this.kbmap['ArrowDown']) {
			pos.x += Math.sin(this.camera.rotation.y) * .05;
			pos.z += Math.cos(this.camera.rotation.y) * .05;
		}


		if (this.kbmap['ArrowLeft']) {
			pos.x -= Math.cos(this.camera.rotation.y) * .05;
			pos.z -= -Math.sin(this.camera.rotation.y) * .05;			
		}

		if (this.kbmap['ArrowRight']) {
			pos.x += Math.cos(this.camera.rotation.y) * .05;
			pos.z += -Math.sin(this.camera.rotation.y) * .05;			
		}
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

		 this.level[m.name] = {tex: idx};
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

		geometry.faceVertexUvs[0].push(
			[ new THREE.Vector2(0, 0), new THREE.Vector2(0, 0), new THREE.Vector2(0, 0) ],
			[ new THREE.Vector2(0, 0), new THREE.Vector2(0, 0), new THREE.Vector2(0, 0) ],
		);

		geometry.computeFaceNormals();
	 
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

class Player
{
	constructor(game)
	{
		this.game = game;
		this.camera = this.game.camera;

		this.x = 0;
		this.y = 0;
		this.rotateY = 0;
	}	
}