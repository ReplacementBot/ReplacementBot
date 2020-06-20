import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Message } from 'discord.js';

export default class PingCommand extends Command
{
	constructor(client: CommandoClient)
	{
		super(client, {
			name: 'ping',
			group: 'other',
			memberName: 'ping',
			description: 'Shows current heartbeat ping and message round-trip',
		});
	}

	async run(message: CommandoMessage, args: any): Promise<Message>
	{
		const reply = await message.channel.send('Pinging...') as Message;
		const messageTripLength = (reply.editedTimestamp || reply.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp);
		const heartBeatPing = this.client.ws.ping ? Math.round(this.client.ws.ping) : 'unknown';

		return reply.edit(
			'Pong :ping_pong:' + '\r' +
			`This message round-trip took ${messageTripLength}ms.` + '\r' +
			`The average heartbeat ping is ${heartBeatPing}ms.`);
	}
}
