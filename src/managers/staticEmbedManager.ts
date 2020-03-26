import { TextChannel, MessageEmbed, Collection, Message, RichEmbed, Guild } from 'discord.js';
import Logger from './logger';
import ReplacementBot from '../replacementBot';
import { Config } from './config';
import { ReplacementsEmbed, ReplacementsEmbedFooterType } from '../models/replacementsEmbed';
import ReplacementDay from '../models/replacementDay';

export default class StaticEmbedManager
{
	bot: ReplacementBot;

	constructor(bot: ReplacementBot)
	{
		this.bot = bot;
		if(this.getChannelsCount() < 0)
		{
			Logger.error('Not found any replacement channels');
		}
	}

	public async updateAllChannels(): Promise<number[]>
	{
		let updatedCount = 0;
		const channels = this.findChannels();
		for(const channel of channels.array())
		{

			this.updateChannel(channel)
				.then((x) =>
				{
					updatedCount++;
				})
				.catch((error) =>
				{
					Logger.error('Failed to update replacements channel: ' + error);
				});
		}
		return [channels.size, updatedCount];
	}

	public async updateChannel(channel: TextChannel): Promise<void>
	{
		return new Promise((resolve, reject) =>
		{
			this.getBotMessage(channel)
				.catch(reject)
				.then((botMessage: Message)=>
				{
					this.bot.replacementsManager.fetchReplacements()
						.catch(reject)
						.then(async (replacements) =>
						{
							const embed = new ReplacementsEmbed(replacements as ReplacementDay).build(
								`Replacements for ${(replacements as ReplacementDay).getWeekDay()}`,
								ReplacementsEmbedFooterType.UPDATED_ON);
							if(botMessage == undefined || botMessage.embeds.length == 0)
							{
								channel.send(embed).then(resolve as any);
							}
							else if(this.areEmbedsSame(embed, botMessage.embeds[0]))
							{
								botMessage.edit(embed).then(resolve as any);
							}
							else
							{
								this.sendPing(channel, embed).then(resolve);
							}
						});
				});

		});
	}

	public async updateGuild(guild: Guild): Promise<void[]>
	{
		return new Promise((resolve, reject) =>
		{
			const channelsUpdatePromises = new Array<Promise<void>>();
			for(const channel of this.findChannels(guild).array())
			{
				channelsUpdatePromises.push(this.updateChannel(channel));
			}
			Promise.all(channelsUpdatePromises)
				.then(resolve)
				.catch(reject);
		});
	}

	private sendPing(channel: TextChannel, embed: RichEmbed): Promise<void>
	{
		return new Promise((resolve, reject) =>
		{
			this.getBotMessage(channel).then(async (message) =>
			{
				await message.delete();
				channel.send(embed);
				resolve();
			});
		});
	}

	public getChannelsCount(): number
	{
		return this.findChannels().size;
	}

	private findChannels(guild?: Guild): Collection<string, TextChannel>
	{
		return this.bot.channels.filter((channel: TextChannel) =>
		{
			if(guild && channel.guild != guild) return false;

			if(channel.type == 'text')
			{
				const topic = channel.topic;
				const emoji = Config.getInstance().get('replacementsChannelsTopicEmoji');
				if(topic && emoji)
				{
					return topic.includes(emoji);
				}
			}
		}) as Collection<string, TextChannel>;

	}

	private getBotMessage(channel: TextChannel): Promise<Message>
	{
		return new Promise((resolve, reject) =>
		{
			channel.fetchMessages()
				.then((messages) =>
				{
					resolve(messages.filter(x => x.author.id == this.bot.user.id).last());
				})
				.catch((error: Error) =>
				{
					reject(error);
				});

		});
	}

	private areEmbedsSame(a: RichEmbed, b: MessageEmbed): boolean
	{
		for (let index = 0; index < a.fields.length; index++)
		{
			if(a.fields[index].name != b.fields[index].name) return false;
			if(a.fields[index].value != b.fields[index].value) return false;
		}

		return (a.author == b.author && a.color == b.color && a.description == b.description && a.title == b.title);
	}
}
