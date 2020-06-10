import { Command, CommandoClient, CommandoMessage, FriendlyError } from 'discord.js-commando';
import { Message } from 'discord.js';
import ReplacementBot from '../../replacementBot';
import { ReplacementsEmbed, ReplacementsEmbedFooterType } from '../../models/replacementsEmbed';
import ReplacementDay from '../../models/replacementDay';

import Logger from '../../managers/logger';

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

	async run(message: CommandoMessage, args: any): Promise<Message>
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
				throw new FriendlyError('Failed to fetch replacements: ' + error.message);
			});
	}
}
