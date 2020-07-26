//Empty template

class Main extends NextGameGL {

	init()
	{
		super.init();
		this.fullScreen();

		// (left, up, backward)
		this.camera.position.set(0, 0.5, 5);
		this.camera.lookAt(0, 0.5, 0);
		this.camera.rotation.order = "YXZ"; 		

		this.objects = {};
		this.light = null;

		const textureLoader = new THREE.TextureLoader();

		let wall = {};

		wall.texture = textureLoader.load( 'images/wallset_csb_front2.png' );
		wall.texture.anisotropy = 16;
		wall.geometry = new THREE.BoxGeometry(1,1,1);
		wall.material = new THREE.MeshLambertMaterial( { map: wall.texture, color: '#FFFFFF' } );

		this.objects.wall = wall;

		this.player = new Player(this);

		this.createScene();
		this.addLights();
	}

	createScene()
	{
		let wall = this.objects.wall;
		let m = new THREE.Mesh( wall.geometry, wall.material );
		m.position.y = 0.5;
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
		// this.light.position.x = 10;
		// this.light.position.y = 50;
		// this.light.position.z = 130;
		this.light.position.copy(this.camera.position);

		// add to the scene
		this.scene.add(this.light);		
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