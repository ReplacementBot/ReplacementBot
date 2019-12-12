process.on('unhandledRejection', function(reason, promise)
{
	console.log(promise);
	Logger.fatalAndCrash('Unhandled Promise Rejection');
});

const { Client } = require('discord.js');
const Logger = require('./managers/logger');
const CommandsManager = require('./managers/commandManager');
const ScheduleManager = require('./managers/scheduleManager');
const { Config, ConfigSettings, ConfigSources } = require('./managers/config');

// CONFIG INITIALIZATION CONFIGURATION
const configSettings = new ConfigSettings(ConfigSources.AUTO);

class ReplacementBot extends Client
{
	constructor()
	{
		Logger.printLogo();
		Logger.info('Initialling ReplacementBot...');

		super();
		global.config = new Config(configSettings);
		this.commandsManager = new CommandsManager();
		this.scheduleManager = new ScheduleManager(this);

		this.login(process.env.REPLACEMENT_BOT_TOKEN)
			.catch((error) => Logger.fatal('Failed to launch ReplacementBot ' + error.message))
			.then(() =>
			{
				this.scheduleManager.scheduleDefaultJobs(this);
				this.on('message', this.commandsManager.executeCommand);
				global.config.validateAfterBotLaunch(this);
				Logger.info('ReplacementBot successfully launched!');
				Logger.info('Bot user is: ' + this.user.tag);
			});
	}
}

// Run bot
new ReplacementBot();

