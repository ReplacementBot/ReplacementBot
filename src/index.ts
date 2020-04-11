import ReplacementBot from './replacementBot';
import Logger from './managers/logger';

new ReplacementBot().start()
	.catch((error) =>
	{
		Logger.fatalAndCrash('Failed to start ReplacementBot: ' + error);
	});

process.on('unhandledRejection', function(reason, promise)
{
	Logger.fatal('Unhandled Promise Rejection');
	console.log(promise);
	process.exit(5);
});
