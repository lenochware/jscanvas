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
}