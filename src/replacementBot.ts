import Logger from './managers/logger';
import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import Config from './managers/config';
import ReplacementsManager from './managers/replacementsManager';
import StaticEmbedManager from './managers/staticEmbedManager';
import Helpers from './util/helpers';
import UnitTestDispatcher from './util/commandoCustomDispatcher';

export default class ReplacementBot extends CommandoClient
{
	replacementsManager: ReplacementsManager;
	staticEmbedManager: StaticEmbedManager;

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

		// @ts-ignore dispatchers have import problems
		if(Helpers.isRunningInTest()) this.dispatcher = new UnitTestDispatcher(this, this.registry);

		this.replacementsManager = new ReplacementsManager();
		this.staticEmbedManager = new StaticEmbedManager(this);

		this.setupCommandsRegistry();
	}

	public async start(): Promise<string>
	{
		return new Promise((resolve, reject) =>
		{
			this.login(Helpers.getBotToken())
				.catch((error) =>
				{
					Logger.fatal('Failed to launch ReplacementBot ' + error.message);
					reject(`Failed to launch ReplacementBot ${error.message}`);
				})
				.then(async ()=>
				{
					if(!Helpers.isRunningInTest())
					{
						await this.replacementsManager.initialize(Config.get('fetcher').name);
					}
					Logger.info('ReplacementBot successfully launched!');
					Logger.info('Bot user is: ' + this.user.tag + ' in ' + this.user.client.guilds.size + ' guilds');
					Logger.info('Next embed update: not implemented');
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
}
