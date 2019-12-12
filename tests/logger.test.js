const Logger = require('../src/managers/logger');
const chalk = require('chalk');
describe('Logger', () =>
{
	test('should info', () =>
	{
		console.log = jest.fn();
		Logger.info('Test');
		expect(console.log).toHaveBeenCalledWith(chalk.bold.white('[INFO] ') + 'Test');
	});
	test('should crash on fatal', () =>
	{
		expect(() =>
		{
			Logger.fatalAndCrash('Test');
		}).toThrow();
	});
});