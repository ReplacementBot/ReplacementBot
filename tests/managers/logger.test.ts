import Logger from '../../src/managers/logger';
import chalk from 'chalk';
describe('Logger', () =>
{
	test('should info', () =>
	{
		console.log = jest.fn();
		Logger.info('Test');
		expect(console.log).toHaveBeenCalledWith(chalk.bold.white('[INFO] ') + chalk.white('Test'));
	});

	test('should crash on fatal', () =>
	{
		expect(() =>
		{
			Logger.critical('Test');
		}).toThrow();
	});

	test('should give tips', () =>
	{
		console.log = jest.fn();
		expect(() =>
		{
			Logger.critical('REPLACEMENT_BOT_TOKEN is not provided');
		}).toThrow();
		expect(console.log).toHaveBeenCalledWith(chalk.green('TIP: You are missing bot token, please read "Configure Bot" article on wiki!'));
	});
});
