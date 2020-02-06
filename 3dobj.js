class Main extends NextGame {

	init()
	{
		super.init();
		this.canvasImage = this.canvas.image();

		this.objects = {};
		this.objects.sphere = this.createSphere();

		this.view = {};

		this.view.center = {
			x: Math.floor(this.canvasImage.width / 2),
			y: Math.floor(this.canvasImage.height / 2),
			z: 200
		};

		this.view.scale = {x: 128, y: 128, z: 1};
	}


	createSphere()
	{
		let obj = [];

		let third = 12;

		for (let x=0; x<third; x++) for (let y=0; y<third; y++) for (let z=0; z<third; z++) {
			obj[z*third*third+y*third+x] = {
				x: Math.floor(80 * Math.sin((z+1)*Math.PI/(third+1)) * Math.sin((x+y*third)*2*Math.PI/(third**2))), 
				y: Math.floor(80 * Math.sin((z+1)*Math.PI/(third+1)) * Math.cos((x+y*third)*2*Math.PI/(third**2))), 
				z: Math.floor(80 * Math.cos((z+1)*Math.PI/(third+1)))
			}
		}

		return obj;
	}

	putPixel(image, pos, color)
	{
		let v = this.view;
		
		let nx = v.center.x + Math.floor(pos.x * v.scale.x / (pos.z * v.scale.z + v.center.z));
		let ny = v.center.y + Math.floor(pos.y * v.scale.y / (pos.z * v.scale.z + v.center.z));
		
		// let nr=omez((r/2)-(z));
		// let ng=omez((g/2)-(z));
		// let nb=omez((b/2)-(z));
		
		image.putPixel(nx, ny, color);
	}

	update()
	{
		this.requestUpdate();

		//if (this.now() - this.time < 30) return;

		let im = this.canvasImage;

		//---
		let sphere = this.objects.sphere;

		for ( let i=0; i < sphere.length; i++) {
			this.putPixel(im, sphere[i], [255,0,0,255]);
		}

		this.canvas.image(im);

		this.canvas.text(20, 20, '#3f3', this.kb.key);

		if(this.mouse.buttons) {
			this.canvas.circle(this.mouse.x, this.mouse.y, 10, 'lime');
			this.mouse.buttons = 0;
		}

		this.time = this.now();
	}

}