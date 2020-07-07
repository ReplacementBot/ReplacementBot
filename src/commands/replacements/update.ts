import { Command, CommandoMessage } from 'discord.js-commando';
import { Message } from 'discord.js';
import ReplacementBot from '../../replacementBot';
import Config from '../../managers/config';

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
				duration: 30
			}
		});
	}

	async run(message: CommandoMessage, args: string[]): Promise<Message>
	{
		const channel = (this.client as ReplacementBot).replacementsChannelsManager.findAllGuildChannels(message.guild).first();
		if(!channel || channel.isSuitable() !== true)
		{
			return message.reply(`No valid channels found! Please use \`${Config.get('prefix')}verify\` for more information :x:`) as Promise<Message>;
		}
		return channel.update()
			.then(() =>
			{
				return message.reply('Successfully updated this guild :tada:') as Promise<Message>;

			})
			.catch((error)=>
			{
				return message.reply('Failed to update this guild - ' + error + ' :x:') as Promise<Message>;
			});
	}
}
