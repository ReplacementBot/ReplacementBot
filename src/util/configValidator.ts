import { CommandoClient } from 'discord.js-commando';
import { Config } from '../managers/config';
import Logger from '../managers/logger';

export default class ConfigValidator
{
    client: CommandoClient;
    config: Config;
    constructor(client: CommandoClient, config: Config)
    {
    	this.client = client;
    	this.config = config;
    }
    public async validate()
    {
    	await this.verifyOwners();
    }
    private async verifyOwners()
    {
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
