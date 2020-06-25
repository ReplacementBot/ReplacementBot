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
			description: 'Fetch replacements and display them as reply',
			throttling: {
				usages: 1,
				duration: 30,
			},
		});
	}

	async run(message: CommandoMessage, args: any): Promise<Message>
	{
		return (this.client as ReplacementBot).replacementsManager.fetchReplacements()
			.then((replacements: ReplacementDay)=>
			{
				try
				{
					const embed = new ReplacementsEmbed(replacements as ReplacementDay).build(
						`Replacements For ${replacements.getWeekDay()}`,
						ReplacementsEmbedFooterType.GENERATED_ON,
					);
					return message.reply(`<@${message.author.id}> Sure, there are replacements for ${replacements.getWeekDay()}!`, embed) as Promise<Message>;
				}
				catch (error)
				{
					Logger.warn(`Failed to create Replacements Embed. Sending as text (${error.message}`);
					return message.reply(`<@${message.author.id}> Sure, there are replacements for ${replacements.getWeekDay()}!\r\r${replacements.toString(true, true)}`) as Promise<Message>;
				}

			})
			.catch((error)=>
			{
				throw new FriendlyError('Failed to fetch replacements: ' + error.message);
			});
	}
}
