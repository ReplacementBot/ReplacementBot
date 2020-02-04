import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';
import { Message } from 'discord.js';
import DummyFetcher from '../../fetchers/dummyFetcher';
import ReplacementBot from '../../replacementBot';
import { ReplacementsEmbed, ReplacementsEmbedFooterType } from '../../models/replacementsEmbed';

export default class FetchReplacements extends Command
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
		const replacements = (await (this.client as ReplacementBot).replacementsManager.fetchReplacements());
		const embed = new ReplacementsEmbed(replacements).build('Replacements For Today', ReplacementsEmbedFooterType.GENERATED_ON);
		return reply.edit(`<@${message.author.id}> Sure, there are replacements for today!`, embed);
	}
}
