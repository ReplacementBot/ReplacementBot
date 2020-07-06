import { Command, CommandoMessage } from 'discord.js-commando';
import { Message, MessageEmbed } from 'discord.js';
import ReplacementBot from '../../replacementBot';

import Config from '../../managers/config';
import ReplacementsChannel from '../../models/replacementsChannel';

export default class VerifyCommand extends Command
{
	constructor(client: ReplacementBot)
	{
		super(client, {
			name: 'verify',
			group: 'replacements',
			memberName: 'verify',
			description: 'Verify the setup of Replacements Channel in current guild',
			aliases: [ 'v' ],
			guildOnly: true,
		});
	}

	async run(message: CommandoMessage, args: string[]): Promise<Message>
	{
		const channels = (this.client as ReplacementBot).replacementsChannelsManager.findAllGuildChannels(message.guild);

		if(channels.size == 0)
		{
			return message.channel.send(new MessageEmbed()
				.setColor('RED')
				.setTitle('No valid channels found')
				.setDescription('I don\'t have access to any valid channels on that guild.' + '\r\n' +
				`Please keep \`${Config.get('replacementsChannel').topicTag}\` tag in topic of single text channel!`)
				.setFooter('Documentation: https://bit.ly/2AaJycn'));
		}
		else if(channels.size == 1)
		{
			await channels.first().channel.messages.fetch();
			if(channels.first().isSuitable() === true)
			{
				const nextUpdate = (this.client as ReplacementBot).scheduleManager.getJobs()[0].nextDate().fromNow();
				return message.channel.send(new MessageEmbed()
					.setColor('GREEN')
					.setTitle(':tada: Your server is properly configured')
					.setDescription(`I will update **${channels.first().channel}** with newest replacements!\r\nNext update ${nextUpdate}`)
					.setFooter('Documentation: https://bit.ly/2AaJycn'));
			}
			else
			{
				const error = ReplacementsChannel.stringifyIsSatiableError(channels.first().isSuitable());
				return message.channel.send(new MessageEmbed()
					.setColor('ORANGE')
					.setTitle('One semi-valid channel found')
					.setDescription(`${channels.first()} contains \`${Config.get('replacementsChannel').topicTag}\` tag but, ${error}`)
					.setFooter('Documentation: https://bit.ly/2AaJycn'));
			}

		}
		else
		{
			return message.channel.send(new MessageEmbed()
				.setColor('RED')
				.setTitle('Found multiple channels')
				.setDescription(
					`Only${channels.first().channel} will be updated. This is not supported!` + '\r\n' +
					`Please keep only one channel with \`${Config.get('replacementsChannel').topicTag}\` tag` + '\r\n\r\n' +
					`Found **${channels.size}** channels \r\n${channels.map(c => c.channel.toString()).join('\r\n')}`)
				.setFooter('Documentation: https://bit.ly/2AaJycn'));
		}
	}
}
