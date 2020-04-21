import chalk from 'chalk';
import Logger from './managers/logger';
import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import Config from './managers/config';
import ReplacementsManager from './managers/replacementsManager';
import StaticEmbedManager from './managers/staticEmbedManager';
import ScheduleManager, { ScheduledJob } from './managers/scheduleManager';
import { TextChannel } from 'discord.js';

export default class ReplacementBot extends CommandoClient
{
	replacementsManager: ReplacementsManager;
	staticEmbedManager: StaticEmbedManager;
	scheduleManager: ScheduleManager;

	public ready: boolean;

	constructor()
	{
		Logger.printLogo();
		Logger.info('Initialling ReplacementBot...');
		Config.initialize();

		super({
			commandPrefix: Config.get('prefix'),
			owner: Config.get('botOwners'),
			unknownCommandResponse: false,
		});
		this.ready = false;

		// Setup Managers
		this.replacementsManager = new ReplacementsManager();
		this.staticEmbedManager = new StaticEmbedManager(this);
		this.scheduleManager = new ScheduleManager();

		// Setup Listeners
		this.on('commandError', (command, error, message) =>
		{
			const stack = error.stack.replace(error.name + ': ' + error.message + '\n', '');
			Logger.error(
				`Failed to execute ${command.name} command` + '\r\n' +
				`${chalk.bold(error.name)}: ${error.message}` + '\r\n' +
				chalk.gray(`${message.author.tag} said '${message.content}' on ` +
				`#${(message.channel as TextChannel).name} (${message.guild.name})`) + '\r\n' +
				chalk.gray(stack));
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
					this.setupScheduleManager();
					Logger.info('ReplacementBot successfully launched!');
					Logger.info('Bot user is: ' + this.user.tag + ' in ' + this.user.client.guilds.size + ' guilds');
					Logger.info('Next embed update: ' + this.scheduleManager.getJobs()[0].nextDate().fromNow());
					this.ready = true;
					resolve();
				});
		});
	}

	public stop(): Promise<void>
	{
		this.ready = false;
		return this.destroy();
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

	private setupScheduleManager(): void
	{
		this.scheduleManager.addJob(new ScheduledJob(
			Config.get('replacementsChannel').updateCron,
			'Update Channels',
			() =>
			{
				return this.staticEmbedManager.updateAllChannels();
			},
		));
	}
}
