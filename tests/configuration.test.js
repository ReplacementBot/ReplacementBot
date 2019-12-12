const { Config, ConfigSettings, ConfigSources } = require('../src/managers/config');

describe('Configuration Settings', () =>
{
	test('should set to file if auto', () =>
	{
		const settings = new ConfigSettings(ConfigSources.AUTO);
		expect(settings.source).toBe(ConfigSources.FILE);
	});
});

describe('Configuration', () =>
{
	test('should load from file', () =>
	{
		const config = new Config(new ConfigSettings(ConfigSources.FILE, 'tests/resources/config.json'));
		expect(config.get('prefix')).toBe('tt!');
	});
});
