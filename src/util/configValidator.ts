import { CommandoClient } from 'discord.js-commando';
import { Config } from '../managers/config';
import Logger from '../managers/logger';

export default class ConfigValidator
{
	client: CommandoClient | false;
	config: Config;
	constructor(client: CommandoClient | false, config: Config)
	{
		this.client = client;
		this.config = config;
	}
	public async validate(): Promise<void>
	{
		this.verifyCrucialValues();
		await this.verifyOwners();
	}

	private verifyCrucialValues(): void
	{
		const crucialValues = ['prefix', 'fetcherName'];

		for(const value of crucialValues)
		{
			if(!this.config.contains(value))
			{
				Logger.fatalAndCrash(`Config missing crucial ${value} value`);
			}
		}
	}
	private async verifyOwners(): Promise<void>
	{
		if(this.client == false) return;

		const botOwners = this.config.get('botOwners');
		if(botOwners == undefined || !Array.isArray(botOwners) || botOwners.length == 0)
		{
			Logger.warn('Config don\'t contains any bot owner');
			return;
		}

		for await(const ownerId of this.config.get('botOwners'))
		{
			await this.client.fetchUser(ownerId).catch(function(error)
			{
				Logger.warn('Unknown owner id, check config, id: ' + ownerId + ', error: ' + error.message);
			});
		}
	}
}
