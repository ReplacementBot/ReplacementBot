import Logger from './managers/logger';
import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import { ConfigSettings, Config } from './managers/config';
import ReplacementsManager from './managers/replacementsManager';
import StaticEmbedManager from './managers/staticEmbedManager';
import MiscHelpers from './util/miscHelpers';
import UnitTestDispatcher from './util/commandoCustomDispatcher';

export default class ReplacementBot extends CommandoClient
{
	config: Config;
	replacementsManager: ReplacementsManager;
	staticEmbedManager: StaticEmbedManager;

	public ready: boolean;

	constructor(configSettings: ConfigSettings)
	{
		Logger.printLogo();
		Logger.info('Initialling ReplacementBot...');

		const config = new Config(configSettings).makeStatic();

		super({
			commandPrefix: config.get('prefix'),
			owner: config.get('botOwners'),
			unknownCommandResponse: false,
		});
		this.ready = false;

		// @ts-ignore dispatchers have import problems
		if(MiscHelpers.isRunningInTest()) this.dispatcher = new UnitTestDispatcher(this, this.registry);

		this.config = config;
		this.replacementsManager = new ReplacementsManager();
		this.staticEmbedManager = new StaticEmbedManager(this);

		this.setupCommandsRegistry();
	}

	public async start(): Promise<string>
	{
		return new Promise((resolve, reject) =>
		{
			this.login(MiscHelpers.getBotToken())
				.catch((error) =>
				{
					Logger.fatal('Failed to launch ReplacementBot ' + error.message);
					reject(`Failed to launch ReplacementBot ${error.message}`);
				})
				.then(async ()=>
				{
					await this.config.validate(this);
					if(!MiscHelpers.isRunningInTest())
					{
						await this.replacementsManager.initialize(this.config.get('fetcherName'));
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
				['util', 'Utilities'],
			])
			.registerCommandsIn({
				filter: /^([^.].*)\.(js|ts)$/,
				dirname: path.join(__dirname, 'commands'),
			});
	}
}
