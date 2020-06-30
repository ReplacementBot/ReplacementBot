export default class TestUtilities
{
	public static isRunningInTest(): boolean
	{
		return process.env.NODE_ENV === 'test';
	}
}
