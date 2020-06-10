import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Message, MessageEmbed } from 'discord.js';

export default class GitHubCommand extends Command
{
	constructor(client: CommandoClient)
	{
		super(client, {
			name: 'help',
			group: 'util',
			memberName: 'help',
			aliases: ['commands'],
			description: 'Displays a list of available commands.',
		});
	}

	async run(message: CommandoMessage, args: any): Promise<Message>
	{
		const embed = new MessageEmbed()
			.setTitle('Commands List');

		this.client.registry.commands.forEach((command) =>
		{
			embed.addField(this.client.commandPrefix + command.name, command.description);
		});
		return message.channel.send(embed);
	}
}
