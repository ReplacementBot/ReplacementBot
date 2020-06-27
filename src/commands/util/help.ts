import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Message } from 'discord.js';

export default class GitHubCommand extends Command
{
	constructor(client: CommandoClient)
	{
		super(client, {
			name: 'help',
			group: 'util',
			memberName: 'help',
			aliases: ['commands'],
			description: 'Point to documentation list of available commands',
		});
	}

	async run(message: CommandoMessage, args: any): Promise<Message>
	{
		return message.reply('You can find list of all commands here: https://replacementbot.github.io/docs/commands') as Promise<Message>;
	}
}
