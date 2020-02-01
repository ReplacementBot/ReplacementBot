import { Command, CommandoClient, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { oneLine } from "common-tags";

export default class PingCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'ping',
			group: 'util',
			memberName: 'ping',
			description: 'Checks the bot\'s ping to the Discord server.'
		});
	}

	async run(message : CommandMessage, args: any) {
		const reply = await message.channel.send('Pinging...') as Message;
		return reply.edit(oneLine`
			This message round-trip took ${
				(reply.editedTimestamp || reply.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)
			}ms.
			${this.client.ping ? `The average heartbeat ping is ${Math.round(this.client.ping)}ms.` : ''}
		`);
    }
};