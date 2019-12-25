const { Config, ConfigSettings, ConfigSources } = require('../src/managers/config');

describe('Configuration', () =>
{
	test('should load from file', () =>
	{
		const config = new Config(new ConfigSettings(ConfigSources.FILE, 'tests/resources/config.json'));
		expect(config.get('prefix')).toBe('tt!');
	});
});
