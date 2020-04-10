export default class TestUtilities
{

	public static generateFetcherConfig(fetcherName: string, config: object): string
	{
		const result = {} as any;
		result.fetcher = {} as any;
		result.fetcher.name = fetcherName;
		result.fetcher.config = config;
		return JSON.stringify(result);
	}

	public static isRunningInTest(): boolean
	{
		return process.env.NODE_ENV === 'test';
	}
}
