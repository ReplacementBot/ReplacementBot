import { CommandoClient, Command, CommandMessage, FriendlyError } from 'discord.js-commando';
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
			(this.client as ReplacementBot).staticEmbedManager.updateGuild(message.guild)
				.catch((reason: string) =>
				{
					console.log('reject');
					reject(new FriendlyError(reason));
				})
				.then(() =>
				{
					console.log('resolve');
					resolve(message.reply('Successfully updated this guild') as Promise<Message>);
				});
		});
	}
}
