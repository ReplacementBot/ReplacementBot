import Logger from './managers/logger';

import ReplacementBot from '../src/replacementBot';

new ReplacementBot().start()
	.catch((error) =>
	{
		Logger.critical('Startup', 'Failed to start ReplacementBot: ', error);
	});

process.on('uncaughtException', (error: Error) => handleException(error, 'Uncaught Exception'));
process.on('unhandledRejection', (error: Error) => handleException(error, 'Unhandled Promise Rejection'));

function handleException(error: Error, type: 'Unhandled Promise Rejection' | 'Uncaught Exception'): void
{
	Logger.critical('Main Exception Handler', type + 'There wasn\'t any catch block to handle this error', error);
}
