import { Command, CommandMessage } from 'discord.js-commando';
import { Message, RichEmbed } from 'discord.js';
import ReplacementBot from '../../replacementBot';

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

	async run(message: CommandMessage, args: string[]): Promise<Message>
	{
		const channels = (this.client as ReplacementBot).staticEmbedManager.findChannels(message.guild);

		if(channels.size == 0)
		{
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle('No valid channels found')
				.setDescription('I don\'t have aces to any valid channels on this guild')
				.setFooter('Documentation: https://bit.ly/2AaJycn'));
		}
		else
		{
			let channelsTextList = '';
			for(const channel of channels)
			{
				channelsTextList += `${channel[1].name} ${channel[1].parent ? '- ' + channel[1].parent.name : ''}`;
			}
			return message.channel.send(new RichEmbed()
				.setColor('GREEN')
				.setTitle(`${channels.size} valid ${channels.size > 1 ? 'channels' : 'channel'} found`)
				.setDescription(channelsTextList)
				.setFooter('Documentation: https://bit.ly/2AaJycn'));
		}
	}
}
