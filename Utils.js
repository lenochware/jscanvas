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
