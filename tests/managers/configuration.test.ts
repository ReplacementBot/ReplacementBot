import Config from '../../src/managers/config';

describe('Configuration', () =>
{
	test('should load directly', () =>
	{
		process.env.REPLACEMENT_BOT_CONFIG = '';
		Config.initialize('{ "prefix":"test" }');
		expect(Config.get('prefix')).toBe('test');
	});

	test('should load from ENV', () =>
	{
		process.env.REPLACEMENT_BOT_CONFIG = '{ "prefix":"test" }';
		Config.initialize();
		expect(Config.get('prefix')).toBe('test');
	});
});
