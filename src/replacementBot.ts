import Logger from './managers/logger';
import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import Config from './managers/config';
import ReplacementsManager from './managers/replacementsManager';
import ScheduleManager from './managers/scheduleManager';
import { TextChannel } from 'discord.js';
import ReplacementChannelsManager from './managers/replacementChannelsManager';

export default class ReplacementBot extends CommandoClient
{
	replacementsManager: ReplacementsManager;
	scheduleManager: ScheduleManager;
	replacementChannelsManager: ReplacementChannelsManager;

	public ready: boolean;

	constructor()
	{
		Logger.printLogo();
		Logger.info('Initialling ReplacementBot...');
		Config.initialize();

		super({
			commandPrefix: Config.get('prefix'),
			owner: Config.get('botOwners'),
		});
		this.ready = false;

		// Setup Managers
		this.replacementsManager = new ReplacementsManager();
		this.scheduleManager = new ScheduleManager();
		this.replacementChannelsManager = new ReplacementChannelsManager(this);

		// Setup Listeners
		this.on('commandError', (command, error, message) =>
		{
			Logger.error(
				`Failed to execute "${command.name}" command` + '\r\n' +
				'Caused by:' + '\r\n' +
				'User: ' + message.author.tag + '\r\n' +
				'Message: ' + message.content + '\r\n' +
				`Channel: #${(message.channel as TextChannel).name} (${message.guild.name})` + '\r\n' + error);
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
							Logger.info('Successfully loaded ReplacementsManager with: ' + fetcherName);
						})
						.catch((error: Error) =>
						{
							Logger.error('Failed to load ReplacementManager: ' + error.message);
						});
					this.setupCommandsRegistry();
					this.scheduleManager.scheduleDefaultJobs(this);
					Logger.info('ReplacementBot successfully launched!');
					Logger.info('Bot user is: ' + this.user.tag + ' in ' + this.user.client.guilds.cache.size + ' guilds');
					Logger.info('Next embed update: ' + this.scheduleManager.getJobByName('Update Channels').nextExecution());
					this.ready = true;
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
				['other', 'Other Commands'],
			])
			.registerCommandsIn({
				filter: /^([^.].*)\.(js|ts)$/,
				dirname: path.join(__dirname, 'commands'),
			});
	}
}
