import Logger from './managers/logger';
import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import Config from './managers/config';
import ReplacementsManager from './managers/replacementsManager';
import ScheduleManager from './managers/scheduleManager';

import ReplacementsChannelsManager from './managers/replacementsChannelsManager';
import chalk from 'chalk';

export default class ReplacementBot extends CommandoClient
{
	replacementsManager: ReplacementsManager;
	scheduleManager: ScheduleManager;
	replacementsChannelsManager: ReplacementsChannelsManager;

	constructor()
	{
		Logger.printLogo();
		Logger.info('Startup', 'Initialling ReplacementBot...');
		Config.initialize();

		super({
			commandPrefix: Config.get('prefix'),
			owner: Config.get('botOwners')
		});

		// Setup Managers
		this.replacementsManager = new ReplacementsManager();
		this.scheduleManager = new ScheduleManager();
		this.replacementsChannelsManager = new ReplacementsChannelsManager(this);

		// Setup Listeners
		this.on('commandError', (command, error, message) =>
		{
			Logger.error(
				'Commando Error',
				`${chalk.bold(command.name)} produced error while processing ` +
				`${chalk.bold(message.content)} by ${chalk.bold(message.author.id)} on ` +
				`${chalk.bold(message.guild.id)}`,
				error);
		});
	}

	public async start(): Promise<void>
	{
		return new Promise((resolve, reject) =>
		{
			if(process.env.REPLACEMENT_BOT_TOKEN === undefined)
			{
				reject(new Error('REPLACEMENT_BOT_TOKEN is not provided'));
				return;
			}
			this.login(process.env.REPLACEMENT_BOT_TOKEN)
				.then(async ()=>
				{
					await this.replacementsManager.initialize(Config.get('fetcher').name)
						.then((fetcherName: string) =>
						{
							Logger.info('Startup', 'Loaded Fetcher: ' + fetcherName);
						})
						.catch(reject);
					this.setupCommandsRegistry();
					this.scheduleManager.scheduleDefaultJobs(this);
					const nextExecution = this.scheduleManager.getJobByName('Update Channels').nextDate();
					Logger.info('Startup', 'ReplacementBot Ready!');
					Logger.info('Startup', `Total Servers: ${this.guilds.cache.size}`);
					Logger.info('Startup', `Next Update: ${nextExecution.format('dddd HH:mm')} (${nextExecution.fromNow()})`);
					resolve();
				})
				.catch(reject);
		});
	}

	private setupCommandsRegistry(): void
	{
		this.registry
			.registerDefaultTypes()
			.registerGroups([
				['replacements', 'Replacements'],
				['util', 'Utility Commands'],
				['other', 'Other Commands']
			])
			.registerCommandsIn({
				filter: /^([^.].*)\.(js|ts)$/,
				dirname: path.join(__dirname, 'commands')
			});
	}
}
