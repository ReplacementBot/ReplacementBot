import { TextChannel } from 'discord.js';
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
		const otherMessagesExist = this.channel.messages.some(x => x.author.id == this.bot.user.id);
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

	public update(): Promise<void>
	{
		return new Promise((resolve, reject) =>
		{
			if(this.isSuitable() !== true) reject(new Error('Channels is not suitable'));
			this.cleanUp().then(() =>
			{
				this.channel.fetchMessages({ limit: 1 }).then((messages) =>
				{
					const lastMessage = messages.last();
					this.bot.replacementsManager.fetchReplacements()
						.then((replacements: ReplacementDay) =>
						{
							const embed = new ReplacementsEmbed(replacements).build(
								`Replacements for ${replacements.getWeekDay()}`,
								ReplacementsEmbedFooterType.UPDATED_ON);
							if(lastMessage == undefined)
							{
								this.channel.send(embed).then(resolve as any);
							}
							else if(ReplacementsEmbed.compareEmbeds(embed, lastMessage.embeds[0]))
							{
								lastMessage.edit(embed).then(resolve as any);
							}
							else
							{
								lastMessage.delete().then(() =>
								{
									this.channel.send(embed).then(resolve as any);
								});

							}
						});
				});
			}).catch(e => reject(e));
		});
	}

	private cleanUp(): Promise<void>
	{
		return new Promise((resolve, reject) =>
		{
			this.channel.fetchMessages().then((messages) =>
			{
				const messagesToDelete = messages.filter(x => x.id != messages.last().id);
				if(messagesToDelete.size > 0)
				{
					this.channel.bulkDelete(messagesToDelete)
						.then(() => resolve)
						.catch(reject);
				}
				else
				{
					resolve();
				}
			});
		});
	}
}
