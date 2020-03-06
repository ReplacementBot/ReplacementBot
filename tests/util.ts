export default class TestUtilities
{
	public static allowWebFetcherFakeData(turnOn: boolean): void
	{
		if(turnOn)
		{
			process.env.WEB_FETCHER_USE_FAKE_DATA = 'true';
		}
		else
		{
			process.env.WEB_FETCHER_USE_FAKE_DATA = undefined;
		}

	}
}
