import Logger from './logger';
import fs from 'fs';
import appDir from 'app-root-path';
import convict from 'convict';
import moment from 'moment';
import chalk from 'chalk';
import TestUtilities from '../../tests/util';

const configSchema = {
	prefix: {
		format: String,
		default: 'r!'
	},
	botOwners: {
		format: Array,
		default: [] as string[]
	},
	daySwitchHour: {
		format: function check(val: any): void
		{
			if(!moment(val, 'k:m').isValid()) throw new TypeError(`daySwitchHour '${val}' is not in a hh:mm format`);
		},
		default: '16:00'
	},
	replacementsFilter: {
		format: RegExp,
		default: '(.*?)'
	},
	replacementsChannel:
	{
		updateCron: {
			format: String,
			default: '0,30 * * * *'
		},
		topicTag: {
			format: String,
			default: '[RPL-BOT]'
		}
	},
	fetcher: {
		name: {
			format: String,
			default: 'DummyFetcher'
		},
		config: {
			format: Object,
			default: {}
		}
	}
};

export default class Config
{
	private static data: convict.Config<any>;

	public static initialize(data?: string): void
	{
		const parsedData = JSON.parse(data ? data : Config.getJSONData());
		Config.data = convict(configSchema);
		Config.data.load(parsedData);

		// Slightly hacky way to remove default convict prefix https://github.com/mozilla/node-convict/issues/363
		// @ts-ignore types file is outdated
		Config.data.validate({ allowed: 'warn', output: (warning: string) => Logger.warn('Config', 'Found Configuration Errors:\n' + warning.substr(20)) });
	}

	private static getJSONData(): string
	{
		if(fs.existsSync(appDir + '/config/config.json') && !TestUtilities.isRunningInTest())
		{
			return fs.readFileSync(appDir + '/config/config.json').toString();
		}
		else if(process.env.REPLACEMENT_BOT_CONFIG)
		{
			return process.env.REPLACEMENT_BOT_CONFIG;
		}
		else
		{
			Logger.warn('Config', 'Configuration file or ENV not found ' + chalk.gray(appDir + '\\config\\config.json'));
			return '{}';
		}
	}

	public static get(key: string): any
	{
		if(!Config.data) throw new Error('Config is not initialized while something tried to get a value of it');
		if(!Config.data.getSchema().properties[key]) throw new Error(`'${key}' value don't exist in config schema while something tried to access it`);
		return Config.data.get(key);
	}
}
