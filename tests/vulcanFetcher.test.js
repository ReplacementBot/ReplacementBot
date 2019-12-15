const VulcanFetcher = require('../src/replacements/fetchers/vulcanFetcher');
const Replacement = require('../src/replacements/types/replacement');
const { Config, ConfigSettings, ConfigSources } = require('../src/managers/config');
describe('VulcanFetcher', () =>
{
	describe('Single Day', () =>
	{
		const testReplacemetsUrl = 'https://pastebin.com/raw/quyruEy6';
		const vulcanFetcher = new VulcanFetcher();

		test('should fetch replacement', async () =>
		{
			new Config(new ConfigSettings(ConfigSources.FILE, global.testConfigFilePatch)).loadToGlobal();

			await expect(vulcanFetcher.fetchReplacements(testReplacemetsUrl)).resolves.toStrictEqual(
				[
					new Replacement('1', '1 - Example Lesson', '\xa0', '\xa0'),
					new Replacement('3', '1 - Example Lesson', '\xa0', '\xa0'),
					new Replacement('2', '1 - Example Lesson', '\xa0', '\xa0'),
				],
			);
		});
		test('should return empty array when no replacements', async () =>
		{
			new Config(new ConfigSettings(ConfigSources.FILE, 'tests/resources/configClass3.json')).loadToGlobal();
			await expect(vulcanFetcher.fetchReplacements(testReplacemetsUrl)).resolves.toHaveLength(0);
		});
		test('should fail on 404', async () =>
		{
			new Config(new ConfigSettings(ConfigSources.FILE, global.testConfigFilePatch)).loadToGlobal();

			await expect(vulcanFetcher.fetchReplacements('http://httpstat.us/404')).rejects.toEqual(
				'Failed to fetch Vulcan Replacement | Code: 404 | URL: http://httpstat.us/404 | Error: Error: Request failed with status code 404');
		});
	});
	describe('Multiple Days', () =>
	{
		const testReplacemetsUrl = 'https://pastebin.com/raw/quyruEy6';
		const daysArray = [testReplacemetsUrl, testReplacemetsUrl, testReplacemetsUrl];
		const vulcanFetcher = new VulcanFetcher();

		test('should fetch multiple days', async () =>
		{
			new Config(new ConfigSettings(ConfigSources.FILE, global.testConfigFilePatch)).loadToGlobal();

			await vulcanFetcher.fetchMultipleDays(daysArray)
				.then(function(result)
				{
					expect(result.getList().length).toBe(3);
					expect(result.getList()[0]).toStrictEqual(
						{
							'date': 'https://pastebin.com/raw/quyruEy6',
							'replacements' : [new Replacement('1', '1 - Example Lesson', '\xa0', '\xa0'),
								new Replacement('3', '1 - Example Lesson', '\xa0', '\xa0'),
								new Replacement('2', '1 - Example Lesson', '\xa0', '\xa0')],
						},
					);
				});
		});
	});
});