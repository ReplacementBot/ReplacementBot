import { Command, CommandMessage } from 'discord.js-commando';
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
			description: 'Updates the replacement embed',
			aliases: [ 'u' ],
			guildOnly: true,
		});
	}

	async run(message: CommandMessage, args: string[]): Promise<Message>
	{
		return new Promise((resolve, reject) =>
		{
			message.channel.send('Updating this guild...')
				.then(statusMessage =>
				{
					(this.client as ReplacementBot).replacementChannelsManager.updateSpecificGuild(statusMessage.guild)
						.catch((reason: Error) =>
						{
							reject(statusMessage.edit(reason.message));
						})
						.then(() =>
						{
							resolve(statusMessage.edit('Successfully updated this guild :tada:') as Promise<Message>);
						});
				});
		});
	}
}
