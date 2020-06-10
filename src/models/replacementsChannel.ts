import { TextChannel, Collection, Message } from 'discord.js';
import moment = require('moment');
import ReplacementBot from '../replacementBot';
import ReplacementDay from './replacementDay';
import { ReplacementsEmbed, ReplacementsEmbedFooterType } from './replacementsEmbed';

export default class ReplacementsChannel
{
	private channel: TextChannel;
	private bot: ReplacementBot;
	constructor(channel: TextChannel, bot: ReplacementBot)
	{
		this.channel = channel;
		this.bot = bot;
	}

	public isSuitable(): true | 'NOT_MANAGEABLE' | 'OTHER_MESSAGES'
	{
		console.log(this.channel.messages.cache, this.bot.user.id);
		const otherMessagesExist = this.channel.messages.cache.some(x => x.author.id != this.bot.user.id);
		if(!this.channel.manageable)
		{
			return 'NOT_MANAGEABLE';
		}
		else if(otherMessagesExist)
		{
			return 'OTHER_MESSAGES';
		}
		else
		{
			return true;
		}
	}

	public stringifyIsSatiableError(error: true | string): string
	{
		if(error === true)
		{
			return 'No Errors Found. Channels is suitable';
		}
		else if(error === 'NOT_MANAGEABLE')
		{
			return 'Bot don\'t have permissions to operate that channel';
		}
		else if(error === 'OTHER_MESSAGES')
		{
			return 'Channel contains messages which are not sent by bot';
		}
		else
		{
			return 'Unknown Error: ' + error;
		}
	}

	public update(): Promise<Message>
	{
		return this.channel.messages.fetch()
			.then(() =>
			{
				if(this.isSuitable() !== true) return Promise.reject(new Error('Channel is not suitable'));
			})
			.then(() => this.cleanUp())
			.then(() => this.bot.replacementsManager.fetchReplacements())
			.then((replacements: ReplacementDay) =>
			{
				console.log('fetched');
				const embed = new ReplacementsEmbed(replacements).build(
					`Replacements for ${replacements.getWeekDay()}`,
					ReplacementsEmbedFooterType.UPDATED_ON);
				if(!this.channel.lastMessage)
				{
					return this.channel.send(embed);
				}
				else if(ReplacementsEmbed.compareEmbeds(embed, this.channel.lastMessage.embeds[0]))
				{
					return this.channel.lastMessage.edit(embed);
				}
				else
				{
					return this.channel.lastMessage.delete()
						.then(() => this.channel.send(embed));
				}
			});
	}

	private cleanUp(): Promise<Collection<string, Message>>
	{
		console.log('s');
		return this.channel.bulkDelete(this.channel.messages.cache.filter(x => x.id != this.channel.lastMessageID));
	}
}
