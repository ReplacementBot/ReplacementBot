import WebFetcher, { HTTPResponse, HTTPResponseType } from '../../src/util/webFetcher';

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
	}, 10000);

	test('should fail on 404', async () =>
	{
		await expect(new WebFetcher().request('https://httpstat.us/404', 'UTF-8')).rejects.toStrictEqual(
			new HTTPResponse(HTTPResponseType.BAD_CODE, undefined, 404),
		);
	}, 10000);

	test('should throw error on invalid encoding argument', async () =>
	{
		await expect(new WebFetcher().request(TEST_URL, 'Lorem ipsum')).rejects.toEqual(
			new HTTPResponse(HTTPResponseType.FAILED, 'WebFetcher Error: "Lorem ipsum" encoding don\'t exist'),
		);
	}, 10000);
});
