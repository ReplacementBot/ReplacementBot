const fs = require('fs');
const appRoot = require('app-root-path');
const Logger = require('./logger');
const ConfigSources =
{
	AUTO: 0,
	FILE: 1,
	ENVIRONMENT: 2,
};

class ConfigSettings
{
	constructor(source, args)
	{
		this.source = source;
		this.args = args;
		if(source == ConfigSources.AUTO)
		{
			if(isRunningOnHeroku())
			{
				this.source = ConfigSources.ENVIRONMENT;
			}
			else
			{
				this.source = ConfigSources.FILE;
				this.args = 'config/default.json';
			}
		}
	}
}
class Config
{
	constructor(settings)
	{
		try
		{
			if(settings.source == ConfigSources.FILE)
			{
				const content = fs.readFileSync(appRoot + '/' + settings.args);
				const json = JSON.parse(content);
				this.data = json;
			}
			else if(settings.source == ConfigSources.ENVIRONMENT)
			{
				this.data = JSON.parse(process.env.REPLACEMENT_BOT_CONFIG);
			}
		}
		catch (error)
		{
			Logger.fatalAndCrash('Failed to load configuration: ' + error.message);
		}

	}
}
Config.prototype.loadToGlobal = function()
{
	global.config = this;
};
Config.prototype.contains = function(key)
{
	if(this.data == undefined)
	{
		return undefined;
	}
	else
	{
		return Object.prototype.hasOwnProperty.call(this.data, key);
	}
};
Config.prototype.get = function(key)
{
	if(this.data == undefined)
	{
		return undefined;
	}
	else if(this.contains(key))
	{
		return this.data[key];
	}
	else
	{
		return undefined;
	}
};
Config.prototype.validateAfterBotLaunch = function(bot)
{
	verifyOwnersIds(bot);
};
async function verifyOwnersIds(bot)
{
	if(!global.config.contains('botOwners') ||
		!Array.isArray(global.config.get('botOwners')) ||
		global.config.get('botOwners').length == 0)
	{
		Logger.warn('No owners specified in config, some commands will be inaccessible');
		return;
	}
	for await(const ownerId of global.config.get('botOwners'))
	{
		await bot.fetchUser(ownerId).catch(function(error)
		{
			Logger.warn('Unknown owner id, check config, id: ' + ownerId + ', error: ' + error.message);
		});
	}
}

function isRunningOnHeroku()
{
	return (process.env._ && process.env._.indexOf('heroku'));
}

module.exports.ConfigSources = ConfigSources;
module.exports.ConfigSettings = ConfigSettings;
module.exports.Config = Config;