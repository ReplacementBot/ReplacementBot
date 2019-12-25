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
	const testConfigFile = new ConfigSettings(ConfigSources.FILE, global.testConfigFilePatch);
	test('should load from file', () =>
	{
		const config = new Config(testConfigFile);
		expect(config.get('prefix')).toBe('tt!');
	});
	test('should load to global', () =>
	{
		new Config(testConfigFile).loadToGlobal();
		expect(global.config.get('prefix')).toBe('tt!');
	});
});
