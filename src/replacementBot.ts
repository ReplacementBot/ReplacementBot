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
	startupOptions: StartupOptions;

	public ready: boolean;

	constructor(configSettings: ConfigSettings, options: StartupOptions = {})
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

		if(!options.initializeReplacements) options.initializeReplacements = true;

		// @ts-ignore dispatchers have import problems
		if(options.useTestDispatcher) this.dispatcher = new UnitTestDispatcher(this, this.registry);

		this.config = config;
		this.replacementsManager = new ReplacementsManager();
		this.staticEmbedManager = new StaticEmbedManager(this);
		this.startupOptions = options;

		this.setupCommandsRegistry();
	}

	public async start(): Promise<string>
	{
		return new Promise((resolve, reject) =>
		{
			if(this.startupOptions.initializeReplacements) this.replacementsManager.initialize(this.config.get('fetcherName'));
			this.login(MiscHelpers.getBotToken())
				.catch((error) =>
				{
					Logger.fatal('Failed to launch ReplacementBot ' + error.message);
					reject(`Failed to launch ReplacementBot ${error.message}`);
				})
				.then(async ()=>
				{
					await this.config.validate(this);
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

export type StartupOptions =
{
	useTestDispatcher?: boolean;
	initializeReplacements?: boolean;
};
