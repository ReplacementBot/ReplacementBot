import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';
import { Message } from 'discord.js';
import DummyFetcher from '../../fetchers/dummyFetcher';
import ReplacementBot from '../../replacementBot';

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
		const replacements = (await (this.client as ReplacementBot).replacementsManager.fetchReplacements()).toString();
		return reply.edit(replacements);
	}
}
