import Logger from '../../src/managers/logger';
import chalk from 'chalk';
describe('Logger', () =>
{
	test('should info', () =>
	{
		console.log = jest.fn();
		Logger.info('Source', 'Message');
		expect(console.log).toHaveBeenCalledWith(chalk.white.bold('[INFO] ') + chalk.white('Source - Message'));
	});

	test('should crash on fatal', () =>
	{
		expect(() =>
		{
			Logger.critical('Test', 'Test');
		}).toThrow();
	});
});
