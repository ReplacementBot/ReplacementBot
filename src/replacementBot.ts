import Logger from './managers/logger';
import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import { ConfigSettings, Config } from './managers/config';

export default class ReplacementBot extends CommandoClient
{
	config: Config;
	constructor(configSettings: ConfigSettings)
	{
		Logger.printLogo();
		Logger.info('Initialling ReplacementBot...');

		const config = new Config(configSettings);
		config.loadToGlobal();

		super({
			commandPrefix: config.get('prefix'),
			owner: config.get('botOwners'),
		});

		this.config = config;
		this.setupCommandsRegistry();
	}
	public async start(): Promise<void>
	{
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
				['util', 'Utilities'],
			])
			.registerCommandsIn(path.join(__dirname, 'commands'));
	}
}
