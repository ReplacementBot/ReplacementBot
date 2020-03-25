import { Config, ConfigSettings, ConfigSources } from '../src/managers/config';

describe('Configuration', () =>
{
	const configSettings = new ConfigSettings(ConfigSources.FILE, 'tests/resources/loadTest.yaml');
	test('should load from file', () =>
	{
		const config = new Config(configSettings);
		expect(config.get('prefix')).toBe('r!');
	});

	test('#makeStatic', () =>
	{
		new Config(configSettings).makeStatic();
		expect(Config.getInstance().get('prefix')).toBe('r!');
	});

	test('should detect errors in config', () =>
	{
		const config = new Config(configSettings);
		expect(config.contains('fetcherName')).toBe(false);

		expect(config.validate(false)).rejects.toStrictEqual(new Error('Config missing crucial fetcherName value'));
	});
});
