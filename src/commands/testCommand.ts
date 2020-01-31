import { Command, CommandMessage, CommandoClient } from 'discord.js-commando';

export default class TestCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'test',
			group: 'misc',
			memberName: 'test',
			description: 'test commando system',
			guildOnly: true,
		});
    }
    async run(message : CommandMessage, args: any) {
		return message.reply('hello.');
    }
}