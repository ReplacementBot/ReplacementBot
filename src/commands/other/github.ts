import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Message } from 'discord.js';

export default class GitHubCommand extends Command
{
	constructor(client: CommandoClient)
	{
		super(client, {
			name: 'github',
			group: 'other',
			aliases: ['gh', 'opensource', 'oss', 'source', 'contribute'],
			memberName: 'github',
			description: 'Show Replacement\'s bot GitHub link',
		});
	}

	async run(message: CommandoMessage, args: any): Promise<Message>
	{
		return message.channel.send(
			'**ReplacementBot** is a Open Source project made with :heart:' + '\r\n' +
            'GitHub: https://github.com/MrBartusek/ReplacementBot',
		) as Promise<Message>;
	}
}
