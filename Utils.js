class Utils
{
	static random(min, max)
	{
		return Math.floor(Math.random() * (max - min) + min);
	}

	static round(value, precision)
	{
		return value.toFixed(precision);
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