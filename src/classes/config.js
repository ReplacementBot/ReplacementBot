const fs = require('fs');
const appRoot = require('app-root-path');
const ConfigSources =
{
	AUTO: 0,
	FILE: 1,
	ENVIRONMENT: 2,
};
class Config
{
	constructor(source, args)
	{
		if(source == ConfigSources.AUTO)
		{
			if(isRunningOnHeroku())
			{
				source = ConfigSources.ENVIRONMENT;
			}
			else
			{
				source = ConfigSources.FILE;
				args = 'config/default.json';
			}
		}

		if(source == ConfigSources.FILE)
		{
			const content = fs.readFileSync(appRoot + '/' + args);
			const json = JSON.parse(content);
			this.data = json;
		}
		else if(source == ConfigSources.ENVIRONMENT)
		{
			this.data = JSON.parse(process.env.REPLACEMENT_BOT_CONFIG);
		}
		else
		{
			throw new Error('Unknown config source');
		}
	}
}
Config.ConfigSources = ConfigSources;
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
module.exports = Config;

function isRunningOnHeroku()
{
	return (process.env._ && process.env._.indexOf('heroku'));
}