import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Message } from 'discord.js';

export default class GitHubCommand extends Command
{
	constructor(client: CommandoClient)
	{
		super(client, {
			name: 'issue',
			group: 'other',
			aliases: ['bug', 'problem', 'broken', 'feature', 'enhancement'],
			memberName: 'issue',
			description: 'Display instruction for reporting bugs and features'
		});
	}

	async run(message: CommandoMessage, args: any): Promise<Message>
	{
		return message.channel.send('Please report any issues or feature request to github:\r\nhttps://github.com/ReplacementBot/ReplacementBot/issues');
	}
}
