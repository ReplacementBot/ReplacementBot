import Logger from './managers/logger';
import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import { ConfigSettings, Config } from './managers/config';
import ReplacementsManager from './managers/replacementsManager';
import StaticEmbedManager from './managers/staticEmbedManager';

export default class ReplacementBot extends CommandoClient
{
	config: Config;
	replacementsManager: ReplacementsManager;
	staticEmbedManager: StaticEmbedManager;

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

		this.config = config;
		this.replacementsManager = new ReplacementsManager();
		this.staticEmbedManager = new StaticEmbedManager(this);

		this.setupCommandsRegistry();
	}
	public async start(): Promise<void>
	{
		await this.replacementsManager.initialize(this.config.get('fetcherName'));

		this.login(process.env.REPLACEMENT_BOT_TOKEN)
			.catch((error) => Logger.fatal('Failed to launch ReplacementBot ' + error.message))
			.then(async ()=>
			{
				await this.config.validate(this);
				Logger.info('ReplacementBot successfully launched!');
				Logger.info('Bot user is: ' + this.user.tag + ' in ' + this.user.client.guilds.size + ' guilds');
				Logger.info('Next embed update: not implemented');
			});
	}
	private setupCommandsRegistry(): void
	{
		this.registry
			.registerDefaultTypes()
			.registerGroups([
				['replacements', 'Replacements'],
				['util', 'Utilities'],
			])
			.registerCommandsIn(path.join(__dirname, 'commands'));
	}
}
