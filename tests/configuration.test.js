const { Config, ConfigSettings, ConfigSources } = require('../src/managers/config');

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
