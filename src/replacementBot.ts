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
			owner: Config.get('botOwners'),
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

	public async start(): Promise<string>
	{
		return new Promise((resolve, reject) =>
		{
			if(process.env.REPLACEMENT_BOT_TOKEN === undefined)
			{
				reject(new Error('REPLACEMENT_BOT_TOKEN is not provided'));
				return;
			}
			this.login(process.env.REPLACEMENT_BOT_TOKEN)
				.catch((error) =>
				{
					reject(new Error(`Failed to launch ReplacementBot ${error.message}`));
				})
				.then(async ()=>
				{
					await this.replacementsManager.initialize(Config.get('fetcher').name)
						.then((fetcherName: string) =>
						{
							Logger.info('Startup', 'Successfully loaded ReplacementsManager with ' + fetcherName);
						})
						.catch(reject);
					this.setupCommandsRegistry();
					this.scheduleManager.scheduleDefaultJobs(this);
					Logger.info('Startup', 'ReplacementBot Ready!');
					resolve();
				});
		});
	}

	private setupCommandsRegistry(): void
	{
		this.registry
			.registerDefaultTypes()
			.registerGroups([
				['replacements', 'Replacements'],
				['util', 'Utility Commands'],
				['other', 'Other Commands'],
			])
			.registerCommandsIn({
				filter: /^([^.].*)\.(js|ts)$/,
				dirname: path.join(__dirname, 'commands'),
			});
	}
}
