import { Command, CommandoMessage } from 'discord.js-commando';
import { Message, MessageEmbed } from 'discord.js';
import ReplacementBot from '../../replacementBot';
import ReplacementsChannel from '../../models/replacementsChannel';

export default class VerifyCommand extends Command
{
	constructor(client: ReplacementBot)
	{
		super(client, {
			name: 'verify',
			group: 'replacements',
			memberName: 'verify',
			description: 'Verify configuration of Replacements Channel',
			aliases: [ 'v' ],
			guildOnly: true,
		});
	}

	async run(message: CommandoMessage, args: string[]): Promise<Message>
	{
		const channels = (this.client as ReplacementBot).replacementChannelsManager.findChannels()
			.filter(x => x.guild.id === message.guild.id);

		if(channels.size == 0)
		{
			return message.channel.send(new MessageEmbed()
				.setColor('RED')
				.setTitle('No valid channels found')
				.setDescription('I don\'t have access to any valid channels on that guild')
				.setFooter('Documentation: https://bit.ly/2AaJycn'));
		}
		else if(channels.size == 1)
		{
			await channels.first().messages.fetch();
			const replacementsChannel = new ReplacementsChannel(channels.first(), (this.client as ReplacementBot));
			if(replacementsChannel.isSuitable() === true)
			{
				const nextUpdate = (this.client as ReplacementBot).scheduleManager.getJobs()[0].nextDate().fromNow();
				return message.channel.send(new MessageEmbed()
					.setColor('GREEN')
					.setTitle(':tada: Your server is properly configured')
					.setDescription(`I will update **${channels.first()}** with newest replacements!\r\nNext update ${nextUpdate}`)
					.setFooter('Documentation: https://bit.ly/2AaJycn'));
			}
			else
			{
				const error = replacementsChannel.stringifyIsSatiableError(replacementsChannel.isSuitable());
				return message.channel.send(new MessageEmbed()
					.setColor('RED')
					.setTitle('One semi-valid channel found')
					.setDescription(`${channels.first()} ${error}`)
					.setFooter('Documentation: https://bit.ly/2AaJycn'));
			}

		}
		else
		{
			return message.channel.send(new MessageEmbed()
				.setColor('RED')
				.setTitle('Found multiple channels')
				.setDescription(`Only one channel at the time is allowed per guild, found ${channels.size} channels ${channels.array().join('\r\n')}`)
				.setFooter('Documentation: https://bit.ly/2AaJycn'));
		}
	}
}
