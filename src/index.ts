import Logger from './managers/logger';
import chalk from 'chalk';
import ReplacementBot from '../src/replacementBot';

new ReplacementBot().start()
	.catch((error) =>
	{
		Logger.critical('Failed to start ReplacementBot: ' + error.message);
	});

process.on('uncaughtException', (error: Error) => handleException(error, 'Uncaught Exception'));
process.on('unhandledRejection', (error: Error) => handleException(error, 'Unhandled Promise Rejection'));

function handleException(error: Error, type: 'Unhandled Promise Rejection' | 'Uncaught Exception'): void
{
	const stack = error.stack.replace(error.name + ': ' + error.message + '\n', '');
	Logger.critical(
		type + '\r\n' +
		'There wasn\'t any catch block to handle this error' + '\r\n' +
		`${chalk.bold(error.name)} ${error.message}` + '\r\n' + chalk.gray(stack));
}
