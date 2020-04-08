import ReplacementBot from './replacementBot';
import Logger from './managers/logger';

new ReplacementBot().start();

process.on('unhandledRejection', function(reason, promise)
{
	Logger.fatal('Unhandled Promise Rejection');
	console.log(promise);
	process.exit(5);
});
