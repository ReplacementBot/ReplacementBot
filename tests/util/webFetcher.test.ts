import WebFetcher, { WebFetcherResponse, WebFetcherResponseType } from '../../src/util/webFetcher';

const TEST_URL = 'https://webscraper.io/test-sites/tables';

describe('WebFetcher', () =>
{
	test('should fetch example page', async () =>
	{
		await expect(new WebFetcher().request(TEST_URL, 'UTF-8')).resolves.toEqual(
			expect.objectContaining({
				result: expect.stringContaining('Table playground'),
			}),
		);
	}, 20 * 1000);

	test('should fail on 404', async () =>
	{
		await expect(new WebFetcher().request('https://httpstat.us/404', 'UTF-8')).rejects.toStrictEqual(
			new WebFetcherResponse(WebFetcherResponseType.BAD_CODE, undefined, 404),
		);
	}, 20 * 1000);

	test('should throw error on invalid encoding argument', async () =>
	{
		await expect(new WebFetcher().request(TEST_URL, 'Lorem ipsum')).rejects.toEqual(
			new WebFetcherResponse(WebFetcherResponseType.FAILED, 'WebFetcher Error: "Lorem ipsum" encoding don\'t exist'),
		);
	}, 20 * 1000);
});
