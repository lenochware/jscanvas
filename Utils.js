class Utils
{
	static random(min, max)
	{
		return Math.floor(Math.random() * (max - min) + min);
	}

	static seedRandInt()
	{
		Utils.seed = (Utils.seed * 185852 + 1) % 34359738337;
		return Utils.seed;
	}

	static seedRandFloat()
	{
		return Utils.seedRandInt() / 34359738337;
	}


	static seedRandInt2()
	{
		Utils.seed += 0xe120fc15;
		
		//uint64_t tmp;
		let tmp = /*(uint64_t)*/Utils.seed * 0x4a39b70d;
		let m1 = (tmp >> 16) ^ tmp;
		tmp = /*(uint64_t)*/m1 * 0x12fad5c9;
		let m2 = (tmp >> 16) ^ tmp;
		return m2;
	}

	//Lehmer seedable random number generator
	static seedRandom(min, max)
	{
		return (Utils.seedRandInt2() % (max - min)) + min;
	}

	static round(value, precision)
	{
		return value.toFixed(precision);
	}

	static clamp(x, a, b)
	{
		return Math.max(a, Math.min(x, b));
	}

	static isEmpty(input)
	{
		 if (typeof input === 'array') {
		    return input.length === 0;
		  }

		  return !input || Object.keys(input).length === 0;
	}

	static getUrlParam(name)
	{
		let results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		if (results == null) {
			return null;
		}

		return decodeURI(results[1]) || 0;
	}
}

Utils.seed = Date.now();

class Perlin
{
	constructor()
	{
		this.data = this.create_random_data(4095);

		this.octaves = 4;
		this.amp_falloff = 0.5;

		this.PERLIN_YWRAPB = 4;
		this.PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB;
		this.PERLIN_ZWRAPB = 8;
		this.PERLIN_ZWRAP = 1 << this.PERLIN_ZWRAPB;
	}

	scaled_cosine(i) 
	{ 
		return 0.5 * (1.0 - Math.cos(i * Math.PI)); 
	};

	create_random_data(size)
	{
    let data = new Array(size + 1);
    for (let i = 0; i < size + 1; i++) {
      data[i] = Math.random();
    }

    return data;
	}

	noise(x, y = 0, z = 0)
	{
	  if (x < 0) {
	    x = -x;
	  }
	  if (y < 0) {
	    y = -y;
	  }
	  if (z < 0) {
	    z = -z;
	  }

	  let xi = Math.floor(x),
	    yi = Math.floor(y),
	    zi = Math.floor(z);
	  let xf = x - xi;
	  let yf = y - yi;
	  let zf = z - zi;
	  let rxf, ryf;

	  let r = 0;
	  let ampl = 0.5;

	  let n1, n2, n3;

	  let size = this.data.length;

	  for (let o = 0; o < this.perlin_octaves; o++) {
	    let of = xi + (yi << this.PERLIN_YWRAPB) + (zi << this.PERLIN_ZWRAPB);

	    rxf = this.scaled_cosine(xf);
	    ryf = this.scaled_cosine(yf);

	    n1 = this.data[of & size];
	    n1 += rxf * (this.data[(of + 1) & size] - n1);
	    n2 = this.data[(of + this.PERLIN_YWRAP) & size];
	    n2 += rxf * (this.data[(of + this.PERLIN_YWRAP + 1) & size] - n2);
	    n1 += ryf * (n2 - n1);

	    of += this.PERLIN_ZWRAP;
	    n2 = this.data[of & size];
	    n2 += rxf * (this.data[(of + 1) & size] - n2);
	    n3 = this.data[(of + this.PERLIN_YWRAP) & size];
	    n3 += rxf * (this.data[(of + this.PERLIN_YWRAP + 1) & size] - n3);
	    n2 += ryf * (n3 - n2);

	    n1 += this.scaled_cosine(zf) * (n2 - n1);

	    r += n1 * ampl;
	    ampl *= this.perlin_amp_falloff;
	    xi <<= 1;
	    xf *= 2;
	    yi <<= 1;
	    yf *= 2;
	    zi <<= 1;
	    zf *= 2;

	    if (xf >= 1.0) {
	      xi++;
	      xf--;
	    }
	    if (yf >= 1.0) {
	      yi++;
	      yf--;
	    }
	    if (zf >= 1.0) {
	      zi++;
	      zf--;
	    }
	  }
	  return r;
	};
}

Utils.perlin = new Perlin;