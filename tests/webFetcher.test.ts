import WebFetcher, { HTTPResponse, HTTPResponseType } from '../src/util/webFetcher';
import TestUtilities from './util';
import RootPath = require('app-root-path');

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
	});

	test('should fail on 404', async () =>
	{
		await expect(new WebFetcher().request('https://httpstat.us/404', 'UTF-8')).rejects.toStrictEqual(
			new HTTPResponse(HTTPResponseType.BAD_CODE, undefined, 404),
		);
	});

	test('should throw error on invalid encoding argument', async () =>
	{
		await expect(new WebFetcher().request(TEST_URL, 'Lorem ipsum')).rejects.toEqual(
			new HTTPResponse(HTTPResponseType.FAILED, 'WebFetcher Error: "Lorem ipsum" encoding don\'t exist'),
		);
	});

	test('should use fake data', async () =>
	{
		TestUtilities.allowWebFetcherFakeData(true);
		const FAKE_DATA_FILE = RootPath.path + '\\tests\\resources\\webFetcherFakeData\\testData.txt';
		await expect(new WebFetcher().request(FAKE_DATA_FILE, undefined)).resolves.toEqual(
			expect.objectContaining({
				result: expect.stringContaining('Fake data for Unit Tests!'),
			}),
		);
	});
});
