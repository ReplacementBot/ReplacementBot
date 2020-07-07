import Logger from './logger';
import fs from 'fs';
import appDir from 'app-root-path';
import convict from 'convict';
import moment from 'moment';
import chalk from 'chalk';
import TestUtilities from '../../tests/util';

// doc fields are displayed on documentation

const configSchema = {
	prefix: {
		doc: 'A prefix that needed to be written before every command like: r!help',
		format: String,
		default: 'r!'
	},
	botOwners: {
		format: Array,
		doc: 'List of users ID that can execute owner only commands. Recommended to give it only to people managing specific bot instance.',
		default: [] as string[]
	},
	daySwitchHour: {
		doc: 'A time that bot will fetch replacements for next day' + '\n' +
			'Monday 15:30 - Fetch for Monday' + '\n' +
			'Monday 16:00 - Fetch for Thursday',
		format: function check(val: any): void
		{
			if(!moment(val, 'k:m').isValid()) throw new TypeError(`daySwitchHour '${val}' is not in a hh:mm format`);
		},
		default: '16:00'
	},
	replacementsFilter: {
		doc: 'RegExp that all replacement’s description will be passed through. If it won’t match this replacement won’t be shown.',
		format: RegExp,
		default: '(.*?)'
	},
	replacementsChannel:
	{
		updateCron: {
			doc: 'Cron Expression when replacements channels will be updated',
			format: String,
			default: '0,30 * * * *'
		},
		topicTag: {
			doc: 'Text that replacement’s channel must match to be detected as replacement channel.',
			format: String,
			default: '[RPL-BOT]'
		}
	},
	fetcher: {
		name: {
			doc: 'Name of the fetcher file that will be used.',
			format: String,
			default: 'DummyFetcher'
		},
		config: {
			doc: 'Configuration of the fetcher. Different for all fetchers',
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
		const parsedJSONData = JSON.parse(data ? data : Config.getJSONData());
		Config.data = convict(configSchema);
		Config.data.load(parsedJSONData);

		// Slightly hacky way to remove default convict prefix https://github.com/mozilla/node-convict/issues/363
		// @ts-ignore types file is outdated
		Config.data.validate({ allowed: 'warn', output: (warning: string) => Logger.warn('Configuration Warning: ' + warning.substr(20)) });
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
