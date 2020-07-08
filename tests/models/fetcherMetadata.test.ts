import FetcherMetadata from '../../src/models/fetcherMetadata';

describe('FetcherMetadata', () =>
{
	let metadata: FetcherMetadata;
	test('should load', () =>
	{
		metadata = new FetcherMetadata('{"version":0,"author":"MrBartusek","built-in":true,"description":"Description"}', 'TestFetcher');
	});

	test('should retrieve data', () =>
	{
		expect(metadata.getAuthor()).toBe('MrBartusek');
		expect(metadata.getDescription()).toBe('Description');
		expect(metadata.getName()).toBe('TestFetcher');
		expect(metadata.getService()).toBe(null);
		expect(metadata.isBuiltIn()).toBe(true);
		expect(metadata.isSystem()).toBe(false);
		expect(metadata.isValidVersion()).toBe(true);
	});

	test('should detect invalid version', () =>
	{
		console.log = jest.fn();
		const invalidVersion = new FetcherMetadata('{"version":100,"author":"MrBartusek","built-in":true,"description":"Description"}', 'TestFetcher');
		expect(console.log).toBeCalledWith(expect.stringContaining('Fetcher uses unsupported metadata schema'));
		expect(invalidVersion.isValidVersion()).toBe(false);
	});
});
