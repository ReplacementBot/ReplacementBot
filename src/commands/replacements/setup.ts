import { Command, CommandoMessage } from 'discord.js-commando';
import { Message, MessageEmbed, User, Guild, TextChannel } from 'discord.js';
import ReplacementBot from '../../replacementBot';
import Config from '../../managers/config';
import ReplacementsChannel from '../../models/replacementsChannel';

export default class UpdateCommand extends Command
{
	constructor(client: ReplacementBot)
	{
		super(client, {
			name: 'setup',
			group: 'replacements',
			memberName: 'setup',
			description: 'Creates and configures Replacements Channel',
			guildOnly: true,
			userPermissions: ['MANAGE_CHANNELS'],
		});
	}

	async run(message: CommandoMessage, args: string[]): Promise<Message>
	{
		const foundChannel = (this.client as ReplacementBot).replacementsChannelsManager.findAllGuildChannels(message.guild).first();
		if(foundChannel)
		{
			return message.channel.send(new MessageEmbed()
				.setColor('RED')
				.setTitle('Cannot Create Channel')
				.setDescription(
					'I cannot create any more channels because one or more is already created' + '\r\n' +
					`Use \`${Config.get('prefix')}verify\` for more information`,
				)
				.setFooter('Documentation: https://bit.ly/2AaJycn'));
		}

		await this.createChannel(message.guild, message.author)
			.then(channel => new ReplacementsChannel(channel, this.client as ReplacementBot))
			.then(channel =>
			{
				if(channel.isSuitable() === true)
				{
					channel.update()
						.then(() =>
						{
							return message.channel.send(new MessageEmbed()
								.setColor('GREEN')
								.setTitle(':tada:  Channel has been created')
								.setDescription(`Channel ${channel.channel} has been successfully created and now will be automatically updated!`)
								.setFooter('Documentation: https://bit.ly/2AaJycn'));
						})
						.catch(() =>
						{
							return message.channel.send(new MessageEmbed()
								.setColor('ORANGE')
								.setTitle('Channel created but not updated')
								.setDescription(
									`Channel ${channel.channel} has been successfully created but update failed` + '\r\n' +
									`Please try \`${Config.get('prefix')}update\` to update manually`,
								)
								.setFooter('Documentation: https://bit.ly/2AaJycn'));
						});
				}
				else
				{
					channel.channel.delete('Creation failed, rollback')
						.then(() =>
						{
							return message.channel.send(new MessageEmbed()
								.setColor('RED')
								.setTitle('Channel hasn\'t been created')
								.setDescription(
									'Creator tried to create channel but failed, rollback was successful' + '\r\n' +
									'Please use manual setup!',
								)
								.addField('Error', 'Channel not suitable - ' + ReplacementsChannel.stringifyIsSatiableError(channel.isSuitable()))
								.setFooter('Documentation: https://bit.ly/2AaJycn'));
						})
						.catch((error) =>
						{
							return message.channel.send(new MessageEmbed()
								.setColor('RED')
								.setTitle('Creator Failed Terribly')
								.setDescription(
									'Creator tried to create channel but failed, rollback also failed' + '\r\n' +
									'Please delete ${channel.channel} channel and use manual setup!',
								)
								.addField('Error', error)
								.setFooter('Documentation: https://bit.ly/2AaJycn'));
						});
				}
			})
			.catch((error) =>
			{
				return message.channel.send(new MessageEmbed()
					.setColor('RED')
					.setTitle('Creator Failed Terribly')
					.setDescription('Channel creator found a fatal problem, changes probably hasn\'t been rollback')
					.addField('Error', error)
					.setFooter('Documentation: https://bit.ly/2AaJycn'));
			});

	}

	createChannel(guild: Guild, author: User): Promise<TextChannel>
	{
		return guild.channels.create(
			'replacements',
			{
				type: 'text',
				topic:
					Config.get('replacementsChannel').topicTag + '\r\n' +
					'That channel will be automatically updated by ReplacementBot ' + '\r\n' +
					'Website: https://replacementbot.github.io' + '\r\n' +
					'Documentation: https://replacementbot.github.io/docs/replacements_channel',
				reason: `Channel created by ${author.discriminator} (${author.id})`,
			},
		);
	}
}
