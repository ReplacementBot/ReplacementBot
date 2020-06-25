import { Command, CommandoMessage } from 'discord.js-commando';
import { Message } from 'discord.js';
import ReplacementBot from '../../replacementBot';

export default class UpdateCommand extends Command
{
	constructor(client: ReplacementBot)
	{
		super(client, {
			name: 'update',
			group: 'replacements',
			memberName: 'update',
			description: 'Updates Replacements Channel of current guild',
			aliases: [ 'u' ],
			guildOnly: true,
			userPermissions: ['MANAGE_CHANNELS'],
			throttling: {
				usages: 1,
				duration: 30,
			},
		});
	}

	async run(message: CommandoMessage, args: string[]): Promise<Message>
	{
		const reply = await message.channel.send('Updating this guild...') as Message;
		return (this.client as ReplacementBot).replacementChannelsManager.updateSpecificGuild(message.guild)
			.then(() =>
			{
				return reply.edit('Successfully updated this guild :tada:');

			})
			.catch((error)=>
			{
				return reply.edit('Failed to update this guild - ' + error + ' :x:');
			});
	}
}
