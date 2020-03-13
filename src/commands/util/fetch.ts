import { Command, CommandoClient, CommandMessage, FriendlyError } from 'discord.js-commando';
import { Message } from 'discord.js';
import DummyFetcher from '../../fetchers/dummyFetcher';
import ReplacementBot from '../../replacementBot';
import { ReplacementsEmbed, ReplacementsEmbedFooterType } from '../../models/replacementsEmbed';
import ReplacementDay from '../../models/replacementDay';
import moment = require('moment');
import { FetchError, ResponseParseError } from '../../models/replacementsFetcher';
import Logger from '../../managers/logger';
import { Config } from '../../managers/config';

export default class FetchReplacementsCommand extends Command
{
	constructor(client: CommandoClient)
	{
		super(client, {
			name: 'fetch',
			group: 'replacements',
			memberName: 'fetch',
			description: 'Fetch replacements from today',
		});
	}

	async run(message: CommandMessage, args: any): Promise<Message>
	{
		const reply = await message.channel.send('Fetching Replacements...') as Message;
		return (this.client as ReplacementBot).replacementsManager.fetchReplacements()
			.then((replacements: ReplacementDay)=>
			{
				try
				{
					const embed = new ReplacementsEmbed(replacements as ReplacementDay).build(`Replacements For ${replacements.getWeekDay()}`, ReplacementsEmbedFooterType.GENERATED_ON);
					return reply.edit(`<@${message.author.id}> Sure, there are replacements for ${replacements.getWeekDay()}!`, embed);
				}
				catch (error)
				{
					Logger.warn(`Failed to create Replacements Embed. Sending as text (${error.message}`);
					return reply.edit(`<@${message.author.id}> Sure, there are replacements for ${replacements.getWeekDay()}!\r\r${replacements.toString(true, true)}`);
				}

			})
			.catch((error)=>
			{
				Logger.error(`Failed to fetch replacements: ${error.message}\n${error.stack}\n[${message.author.tag} on ${message.guild.name}]`);
				if(error instanceof FetchError || error instanceof ResponseParseError)
				{
					throw new FriendlyError('Failed to fetch replacements: ' + error.message);
				}
				else
				{
					throw error;
				}
			});
	}
}
