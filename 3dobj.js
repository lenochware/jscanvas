class Main extends NextGame {

	init()
	{
		super.init();

		this.objects = {};
		this.objects.sphere = this.createSphere();
		this.objects.cube = this.createCube();
		this.objects.twocubes = this.createTwoCubes();
		this.objects.twospheres = this.createTwoSpheres();

		this.view = {};

		this.view.center = {
			x: Math.floor(this.canvas.width() / 2),
			y: Math.floor(this.canvas.height() / 2),
			z: 200
		};

		this.angle = 0;

		this.view.scale = {x: 128, y: 128, z: 1};
	}


	createSphere()
	{
		let obj = [];

		const SEG = 12;

		for (let x=0; x<SEG; x++) for (let y=0; y<SEG; y++) for (let z=0; z<SEG; z++) {
			obj[z*SEG*SEG+y*SEG+x] = {
				x: Math.floor(80 * Math.sin((z+1)*Math.PI/(SEG+1)) * Math.sin((x+y*SEG)*2*Math.PI/(SEG**2))), 
				y: Math.floor(80 * Math.sin((z+1)*Math.PI/(SEG+1)) * Math.cos((x+y*SEG)*2*Math.PI/(SEG**2))), 
				z: Math.floor(80 * Math.cos((z+1)*Math.PI/(SEG+1)))
			}
		}

		return obj;
	}

	createCube()
	{
		let obj = [];

		const SEG = 12;

		for (let x=0; x<SEG; x++) for (let y=0; y<SEG; y++) for (let z=0; z<SEG; z++) {
			obj[z*SEG*SEG+y*SEG+x] = {
				x : Math.floor((SEG/2-x)*(120/SEG)-8), 
				y : Math.floor((SEG/2-y)*(120/SEG)-8), 
				z : Math.floor((SEG/2-z)*(120/SEG)-8)
			}
		}			

		return obj;
	}

	createTwoCubes()
	{
		let obj = [];

		const SEG = 12;		

		for (let x=0; x<SEG; x++) for (let y=0; y<SEG; y++) for (let z=0; z<SEG; z++) {
			if (x%2 == 0) {
				obj[z*SEG*SEG+y*SEG+x] = {
					x: Math.floor(70*x/SEG), 
					y: Math.floor(70*y/SEG), 
					z: Math.floor(70*z/SEG)
				}				
			}
			else {
				obj[z*SEG*SEG+y*SEG+x] = {
					x: -Math.floor(70*x/SEG), 
					y: -Math.floor(70*y/SEG), 
					z: -Math.floor(70*z/SEG)
				}
			}
		}			

		return obj;
	}

	createTwoSpheres()
	{
		let obj = [];

		const SEG = 12;			

		for (let x=0; x<SEG; x++) for (let y=0; y<SEG; y++) for (let z=0; z<SEG; z++) {
			if (x%2 == 0) {
				obj[z*SEG*SEG+y*SEG+x] = {
					x: 80+Math.floor(40*Math.sin((z+1)*Math.PI/(SEG+1))*Math.sin((x+y*SEG)*2*Math.PI/(SEG**2))), 
					y: Math.floor(40*Math.sin((z+1)*Math.PI/(SEG+1))*Math.cos((x+y*SEG)*2*Math.PI/(SEG**2))), 
					z: Math.floor(40*Math.cos((z+1)*Math.PI/(SEG+1)))
				}
			}
			else {
				obj[z*SEG*SEG+y*SEG+x] = {
					x: -80-Math.floor(40*Math.sin((z+1)*Math.PI/(SEG+1))*Math.sin((x+y*SEG)*2*Math.PI/(SEG**2))), 
					y: -Math.floor(40*Math.sin((z+1)*Math.PI/(SEG+1))*Math.cos((x+y*SEG)*2*Math.PI/(SEG**2))), 
					z: -Math.floor(40*Math.cos((z+1)*Math.PI/(SEG+1)))
				}
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

	sin(i)
	{
		return Math.sin(i * Math.PI / 1800);
	}

	cos(i)
	{
		return Math.cos(i * Math.PI / 1800);
	}

	rotate(sourceObj, ax, ay, az)
	{
		//let obj = sourceObj.slice();
		let obj = [];

		let x,y,z;

		for (let i = 0; i < sourceObj.length; i++)
		{
			//rotace podle X
			y=Math.round(sourceObj[i].y*this.cos(ax)-sourceObj[i].z*this.sin(ax));
			z=Math.round(sourceObj[i].z*this.cos(ax)+sourceObj[i].y*this.sin(ax));
			
			//rotace podle Y
			x=Math.round(sourceObj[i].x*this.cos(ay)-z*this.sin(ay));
			// obj[i].z = Math.round(z*this.cos(ay)+sourceObj[i].x*this.sin(ay));
			
			// //rotace podle Z
			// obj[i].x = Math.round(x*this.cos(az)-y*this.sin(az));
			// obj[i].y = Math.round(y*this.cos(az)+x*this.sin(az));

			obj[i] = {
				x: Math.round(x*this.cos(az)-y*this.sin(az)),
				y: Math.round(y*this.cos(az)+x*this.sin(az)),
				z: Math.round(z*this.cos(ay)+sourceObj[i].x*this.sin(ay))
			}
		}
		
		return obj;
	}

	update()
	{
		this.requestUpdate();

		//if (this.now() - this.time < 30) return;

		this.canvas.clear();
		let im = this.canvas.image();

		//---
		let obj = this.rotate(this.objects.twospheres, 0, this.angle+=10, 0);

		for ( let i=0; i < obj.length; i++) {
			this.putPixel(im, obj[i], [100 - obj[i].z,0,0,255]);
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