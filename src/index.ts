import ReplacementBot from './replacementBot';
import { ConfigSettings, ConfigSources } from './managers/config';
import Logger from './managers/logger';
const configSettings = new ConfigSettings(ConfigSources.AUTO);
new ReplacementBot(configSettings).start();

process.on('unhandledRejection', function(reason, promise)
	{
	Logger.fatal('Unhandled Promise Rejection');
	console.log(promise);
	process.exit(5);
});
