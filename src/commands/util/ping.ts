import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';
import { Message } from 'discord.js';
import MiscHelpers from '../../util/miscHelpers';

export default class PingCommand extends Command
{
	constructor(client: CommandoClient)
	{
		super(client, {
			name: 'ping',
			group: 'util',
			memberName: 'ping',
			description: 'Checks the bot\'s ping to the Discord server.',
		});
	}

	async run(message: CommandMessage, args: any): Promise<Message>
	{
		const reply = await message.channel.send('Pinging...') as Message;
		const messageTripLength = (reply.editedTimestamp || reply.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp);
		const heartBeatPing = this.client.ping ? Math.round(this.client.ping) : 'unknown';

		// Tests might stop the bot before pinging ends
		if(MiscHelpers.isRunningInTest()) return reply;

		return reply.edit(
			`This message round-trip took ${messageTripLength}ms.` + '\r' +
			`The average heartbeat ping is ${heartBeatPing}ms.`);
	}
}
